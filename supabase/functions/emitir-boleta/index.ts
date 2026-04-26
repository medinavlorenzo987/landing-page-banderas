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
    console.log("=== INICIO DE EMISIÓN DE BOLETA ===");

    const bodyText = await req.text();
    console.log("Body recibido:", bodyText);

    let bodyJson: any;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch (e: any) {
      throw new Error(`Error parseando JSON: ${e.message}`);
    }

    // Acepta pedidoId (multi-producto) u orderId (single, retrocompatible)
    const { pedidoId, orderId } = bodyJson;
    if (!pedidoId && !orderId) {
      throw new Error("Se requiere pedidoId o orderId en el body.");
    }

    // Inicializar Supabase
    const supabaseUrl     = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader      = req.headers.get('Authorization');

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });

    // Consultar filas del pedido
    let rows: any[];
    if (pedidoId) {
      console.log("Consultando por pedido_id:", pedidoId);
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .eq('pedido_id', pedidoId);
      if (error) throw new Error(`Error Supabase: ${error.message}`);
      if (!data || data.length === 0) throw new Error("No se encontró el pedido.");
      rows = data;
    } else {
      console.log("Consultando por id:", orderId);
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .eq('id', orderId)
        .single();
      if (error) throw new Error(`Error Supabase: ${error.message}`);
      if (!data) throw new Error("No se encontró el pedido.");
      rows = [data];
    }

    console.log(`Filas encontradas: ${rows.length}`);

    if (rows.some((r: any) => r.comprobante_url)) {
      throw new Error("Este pedido ya tiene un comprobante emitido.");
    }

    // Datos del cliente (compartidos, se toman de la primera fila)
    const cliente     = rows[0];
    const clienteDni  = (cliente.dni ?? '').replace(/\D/g, '');
    const esDniValido = clienteDni.length === 8;
    const tipoDoc     = esDniValido ? "1" : "-";
    const numeroDoc   = esDniValido ? clienteDni : "00000000";

    // Totales globales del pedido
    const totalSoles = rows.reduce((s: number, r: any) => s + (parseFloat(r.total_soles) || 0), 0);
    const valorVenta = totalSoles / 1.18;
    const totalIgv   = totalSoles - valorVenta;

    // Fecha Lima (GMT-5)
    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const parts    = formatter.formatToParts(new Date());
    const limaDate = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`;

    // Construir items de Nubefact — uno por cada producto del pedido
    const items = rows.map((r: any, idx: number) => {
      const itemTotal      = parseFloat(r.total_soles) || 0;
      const itemValorVenta = itemTotal / 1.18;
      const itemIgv        = itemTotal - itemValorVenta;
      const cantidad       = parseFloat(r.cantidad_docenas) || 1;
      return {
        unidad_de_medida:          "NIU",
        codigo:                    `P00${idx + 1}`,
        descripcion:               r.producto || "Bandera Peruana",
        cantidad,
        valor_unitario:            (itemValorVenta / cantidad).toFixed(2),
        precio_unitario:           (itemTotal / cantidad).toFixed(2),
        descuento:                 "",
        subtotal:                  itemValorVenta.toFixed(2),
        tipo_de_igv:               1,
        igv:                       itemIgv.toFixed(2),
        total:                     itemTotal.toFixed(2),
        anticipo_regularizacion:   "false",
        anticipo_documento_serie:  "",
        anticipo_documento_numero: "",
      };
    });

    const codigoUnico = pedidoId ?? orderId.toString();

    const boletaData = {
      operacion:                         "generar_comprobante",
      tipo_de_comprobante:               2,
      serie:                             "BBB1",
      numero:                            "auto",
      sunat_transaction:                 1,
      cliente_tipo_de_documento:         tipoDoc,
      cliente_numero_de_documento:       numeroDoc,
      cliente_denominacion:              cliente.nombre || "CLIENTE VARIOS",
      cliente_direccion:                 cliente.direccion || "",
      cliente_email:                     "",
      cliente_email_1:                   "",
      cliente_email_2:                   "",
      fecha_de_emision:                  limaDate,
      fecha_de_vencimiento:              "",
      moneda:                            1,
      tipo_de_cambio:                    "",
      porcentaje_de_igv:                 18.00,
      descuento_global:                  "",
      total_descuento:                   "",
      total_anticipo:                    "",
      total_gravada:                     valorVenta.toFixed(2),
      total_inafecta:                    "",
      total_exonerada:                   "",
      total_igv:                         totalIgv.toFixed(2),
      total_gratuita:                    "",
      total_otros_cargos:                "",
      total:                             totalSoles.toFixed(2),
      percepcion_tipo:                   "",
      percepcion_base_imponible:         "",
      total_percepcion:                  "",
      total_incluido_percepcion:         "",
      detraccion:                        "false",
      observaciones:                     "",
      documento_que_se_modifica_tipo:    "",
      documento_que_se_modifica_serie:   "",
      documento_que_se_modifica_numero:  "",
      tipo_de_nota_de_credito:           "",
      tipo_de_nota_de_debito:            "",
      enviar_automaticamente_a_la_sunat: "true",
      enviar_automaticamente_al_cliente: "false",
      codigo_unico:                      codigoUnico,
      condiciones_de_pago:               "",
      medio_de_pago:                     "",
      placa_vehiculo:                    "",
      orden_compra_servicio:             "",
      tabla_personalizada_codigo:        "",
      formato_de_pdf:                    "",
      items,
    };

    console.log("Enviando a Nubefact:", JSON.stringify(boletaData, null, 2));

    const nubefactUrl   = Deno.env.get('NUBEFACT_RUTA');
    const nubefactToken = Deno.env.get('NUBEFACT_TOKEN');
    if (!nubefactUrl || !nubefactToken) {
      throw new Error("Faltan NUBEFACT_RUTA o NUBEFACT_TOKEN en los secrets de Supabase.");
    }

    const nubefactResponse = await fetch(nubefactUrl, {
      method: "POST",
      headers: {
        "Authorization": `Token token="${nubefactToken}"`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boletaData),
    });

    const nubefactResultText = await nubefactResponse.text();
    console.log("Respuesta Nubefact:", nubefactResponse.status, nubefactResultText);

    let nubefactResult: any;
    try {
      nubefactResult = JSON.parse(nubefactResultText);
    } catch {
      throw new Error(`Nubefact respuesta no-JSON (${nubefactResponse.status}): ${nubefactResultText}`);
    }

    if (!nubefactResponse.ok || nubefactResult.errors) {
      throw new Error(`Error Nubefact: ${nubefactResult.errors || JSON.stringify(nubefactResult)}`);
    }

    const comprobanteUrl = nubefactResult.enlace_del_pdf;
    if (!comprobanteUrl) {
      throw new Error("Nubefact no devolvió 'enlace_del_pdf'.");
    }

    // Actualizar TODAS las filas del pedido con la URL del comprobante
    const { error: updateError } = pedidoId
      ? await supabase.from('ventas').update({ comprobante_url: comprobanteUrl, estado: 'pagado' }).eq('pedido_id', pedidoId)
      : await supabase.from('ventas').update({ comprobante_url: comprobanteUrl, estado: 'pagado' }).eq('id', orderId);

    if (updateError) {
      throw new Error(`Boleta generada pero falló al guardar en Supabase: ${updateError.message}`);
    }

    console.log("=== COMPLETADO ===");
    return new Response(
      JSON.stringify({ success: true, comprobante_url: comprobanteUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );

  } catch (error: any) {
    console.error("ERROR:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
