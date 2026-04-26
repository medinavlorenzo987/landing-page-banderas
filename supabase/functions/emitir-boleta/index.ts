import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("=== INICIO EMISIÓN COMPROBANTE (ApiSunat) ===");

    const bodyText = await req.text();
    let bodyJson: any;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch (e: any) {
      throw new Error(`Error parseando JSON: ${e.message}`);
    }

    const {
      pedidoId,
      orderId,
      tipoComprobante = 'boleta',
      ruc,
      razonSocial,
    } = bodyJson;

    if (!pedidoId && !orderId) throw new Error("Se requiere pedidoId o orderId en el body.");

    const supabaseUrl     = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader      = req.headers.get('Authorization');

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });

    // Consultar filas del pedido
    let rows: any[];
    if (pedidoId) {
      const { data, error } = await supabase.from('ventas').select('*').eq('pedido_id', pedidoId);
      if (error) throw new Error(`Error Supabase: ${error.message}`);
      if (!data || data.length === 0) throw new Error("No se encontró el pedido.");
      rows = data;
    } else {
      const { data, error } = await supabase.from('ventas').select('*').eq('id', orderId).single();
      if (error) throw new Error(`Error Supabase: ${error.message}`);
      if (!data) throw new Error("No se encontró el pedido.");
      rows = [data];
    }

    if (rows.some((r: any) => r.comprobante_url)) {
      throw new Error("Este pedido ya tiene un comprobante emitido.");
    }

    const firstRow  = rows[0];
    const esFactura = tipoComprobante === 'factura';

    // Serie y número — ID de la primera fila, único por pedido
    const serie  = esFactura ? 'F001' : 'B001';
    const numero = firstRow.id;

    // Datos del cliente
    const clienteRuc    = (ruc || firstRow.ruc || '').replace(/\D/g, '');
    const clienteDni    = (firstRow.dni ?? '').replace(/\D/g, '');
    const clienteNombre = esFactura
      ? (razonSocial || firstRow.razon_social || firstRow.nombre || 'EMPRESA')
      : (firstRow.nombre || 'CLIENTE VARIOS');
    const clienteDir    = firstRow.direccion || '';

    const clienteTipoDoc = esFactura
      ? '6'
      : (clienteDni.length === 8 ? '1' : '0');
    const clienteNumDoc  = esFactura
      ? clienteRuc
      : (clienteDni.length === 8 ? clienteDni : '00000000');

    // Totales y fecha
    const totalSoles = rows.reduce((s: number, r: any) => s + (parseFloat(r.total_soles) || 0), 0);

    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const parts    = formatter.formatToParts(new Date());
    const limaDate = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`;

    // Items — uno por cada fila del pedido
    const items = rows.map((r: any) => {
      const itemTotal     = parseFloat(r.total_soles) || 0;
      const cantidad      = parseFloat(r.cantidad_docenas) || 1;
      const valorUnitario = (itemTotal / 1.18) / cantidad;
      return {
        unidad_de_medida:           "NIU",
        descripcion:                r.producto || "Bandera Peruana",
        cantidad:                   String(cantidad),
        valor_unitario:             valorUnitario.toFixed(6),
        porcentaje_igv:             "18",
        codigo_tipo_afectacion_igv: "10",
        nombre_tributo:             "IGV",
      };
    });

    const comprobanteData = {
      documento:                   esFactura ? 'factura' : 'boleta',
      serie,
      numero,
      fecha_de_emision:            limaDate,
      moneda:                      'PEN',
      tipo_operacion:              '0101',
      cliente_tipo_de_documento:   clienteTipoDoc,
      cliente_numero_de_documento: clienteNumDoc,
      cliente_denominacion:        clienteNombre,
      cliente_direccion:           clienteDir,
      items,
      total:                       totalSoles.toFixed(2),
    };

    console.log("Enviando a ApiSunat:", JSON.stringify(comprobanteData, null, 2));

    const apisunatUrl   = Deno.env.get('APISUNAT_URL') ?? 'https://sandbox.apisunat.pe';
    const apisunatToken = Deno.env.get('APISUNAT_TOKEN');
    if (!apisunatToken) throw new Error("Falta APISUNAT_TOKEN en los secrets de Supabase.");

    const response = await fetch(`${apisunatUrl}/api/v3/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apisunatToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comprobanteData),
    });

    const resultText = await response.text();
    console.log("Respuesta ApiSunat:", response.status, resultText);

    let result: any;
    try {
      result = JSON.parse(resultText);
    } catch {
      throw new Error(`ApiSunat respuesta no-JSON (${response.status}): ${resultText}`);
    }

    if (!response.ok || !result.success) {
      throw new Error(`Error ApiSunat: ${result.message || JSON.stringify(result)}`);
    }

    const comprobanteUrl = result.payload?.pdf?.ticket || result.payload?.pdf?.a4;
    if (!comprobanteUrl) throw new Error("ApiSunat no devolvió URL del PDF.");

    // Actualizar todas las filas del pedido
    const updatePayload: any = {
      comprobante_url:  comprobanteUrl,
      comprobante_tipo: tipoComprobante,
      estado:           'pagado',
    };
    if (esFactura && clienteRuc) {
      updatePayload.ruc          = clienteRuc;
      updatePayload.razon_social = clienteNombre;
    }

    const { error: updateError } = pedidoId
      ? await supabase.from('ventas').update(updatePayload).eq('pedido_id', pedidoId)
      : await supabase.from('ventas').update(updatePayload).eq('id', orderId);

    if (updateError) throw new Error(`Comprobante generado pero falló al guardar: ${updateError.message}`);

    console.log("=== COMPLETADO ===");
    return new Response(
      JSON.stringify({ success: true, comprobante_url: comprobanteUrl, tipo: tipoComprobante }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );

  } catch (error: any) {
    console.error("ERROR:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    );
  }
});
