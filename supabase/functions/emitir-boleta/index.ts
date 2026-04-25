import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("=== INICIO DE EMISIÓN DE BOLETA ===");

    // 1. Obtener payload
    const bodyText = await req.text();
    console.log("Body recibido raw:", bodyText);
    
    let bodyJson;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch (e) {
      throw new Error(`Error parseando el JSON del request: ${e.message}`);
    }

    const { orderId } = bodyJson;
    console.log("ID del pedido a procesar:", orderId);

    if (!orderId) {
      throw new Error("El ID del pedido es requerido (orderId no encontrado en el body).");
    }

    // 2. Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
       console.log("Advertencia: Faltan variables SUPABASE_URL o SUPABASE_ANON_KEY");
    }

    const authHeader = req.headers.get('Authorization');
    console.log("Auth header presente:", !!authHeader);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });

    // 3. Consultar la tabla 'ventas'
    console.log("Consultando la tabla 'ventas' para el ID:", orderId);
    const { data: order, error: orderError } = await supabase
      .from('ventas')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error("Error al consultar Supabase:", orderError);
      throw new Error(`Error al consultar la base de datos: ${orderError.message}`);
    }

    if (!order) {
      console.error("No se encontró ningún registro para el ID:", orderId);
      throw new Error("No se encontró el pedido en la base de datos.");
    }

    console.log("Datos del pedido encontrados:", JSON.stringify(order, null, 2));

    if (order.comprobante_url) {
      console.log("El pedido ya tiene comprobante:", order.comprobante_url);
      throw new Error("Este pedido ya tiene un comprobante emitido.");
    }

    // 4. Preparar credenciales de Nubefact
    const nubefactUrl = Deno.env.get('NUBEFACT_RUTA');
    const nubefactToken = Deno.env.get('NUBEFACT_TOKEN');

    if (!nubefactUrl || !nubefactToken) {
      console.error("Faltan variables NUBEFACT_RUTA o NUBEFACT_TOKEN");
      throw new Error("Faltan configurar las credenciales de Nubefact en los secretos de Supabase.");
    }

    // 5. Cálculos para Nubefact
    const totalSoles = parseFloat(order.total_soles) || 0;
    const valorVenta = totalSoles / 1.18;
    const totalIgv = totalSoles - valorVenta;
    
    const clienteDni = order.dni ? order.dni.replace(/\D/g, '') : "";
    const esDniValido = clienteDni.length === 8;
    const clienteNumeroDoc = esDniValido ? clienteDni : "00000000";
    const clienteTipoDoc = esDniValido ? "1" : "-";
    
    const cantidad = parseFloat(order.cantidad_docenas) || 1;

    // Obtener fecha actual en GMT-5 (Lima, Perú)
    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const limaDate = `${year}-${month}-${day}`;

    const boletaData = {
      operacion: "generar_comprobante",
      tipo_de_comprobante: 2,
      serie: "BBB1",
      numero: "auto",
      sunat_transaction: 1,
      cliente_tipo_de_documento: clienteTipoDoc,
      cliente_numero_de_documento: clienteNumeroDoc,
      cliente_denominacion: order.nombre || "CLIENTE VARIOS",
      cliente_direccion: order.direccion || "",
      cliente_email: "",
      cliente_email_1: "",
      cliente_email_2: "",
      fecha_de_emision: limaDate,
      fecha_de_vencimiento: "",
      moneda: 1,
      tipo_de_cambio: "",
      porcentaje_de_igv: 18.00,
      descuento_global: "",
      total_descuento: "",
      total_anticipo: "",
      total_gravada: valorVenta.toFixed(2),
      total_inafecta: "",
      total_exonerada: "",
      total_igv: totalIgv.toFixed(2),
      total_gratuita: "",
      total_otros_cargos: "",
      total: totalSoles.toFixed(2),
      percepcion_tipo: "",
      percepcion_base_imponible: "",
      total_percepcion: "",
      total_incluido_percepcion: "",
      detraccion: "false",
      observaciones: "",
      documento_que_se_modifica_tipo: "",
      documento_que_se_modifica_serie: "",
      documento_que_se_modifica_numero: "",
      tipo_de_nota_de_credito: "",
      tipo_de_nota_de_debito: "",
      enviar_automaticamente_a_la_sunat: "true",
      enviar_automaticamente_al_cliente: "false",
      codigo_unico: orderId.toString(),
      condiciones_de_pago: "",
      medio_de_pago: "",
      placa_vehiculo: "",
      orden_compra_servicio: "",
      tabla_personalizada_codigo: "",
      formato_de_pdf: "",
      items: [
        {
          unidad_de_medida: "NIU",
          codigo: "P001",
          descripcion: order.producto || "Bandera Peruana",
          cantidad: cantidad, 
          valor_unitario: (valorVenta / cantidad).toFixed(2),
          precio_unitario: (totalSoles / cantidad).toFixed(2),
          descuento: "",
          subtotal: valorVenta.toFixed(2),
          tipo_de_igv: 1,
          igv: totalIgv.toFixed(2),
          total: totalSoles.toFixed(2),
          anticipo_regularizacion: "false",
          anticipo_documento_serie: "",
          anticipo_documento_numero: ""
        }
      ]
    };

    console.log("JSON a enviar a Nubefact:", JSON.stringify(boletaData, null, 2));

    // 6. Llamar a Nubefact
    console.log("Realizando petición POST a Nubefact...");
    const nubefactResponse = await fetch(nubefactUrl, {
      method: "POST",
      headers: {
        "Authorization": `Token token="${nubefactToken}"`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boletaData),
    });

    console.log("Status de la respuesta de Nubefact:", nubefactResponse.status);
    const nubefactResultText = await nubefactResponse.text();
    console.log("Cuerpo de la respuesta de Nubefact:", nubefactResultText);

    let nubefactResult;
    try {
        nubefactResult = JSON.parse(nubefactResultText);
    } catch (e) {
        throw new Error(`Nubefact devolvió una respuesta no JSON (Status: ${nubefactResponse.status}): ${nubefactResultText}`);
    }

    if (!nubefactResponse.ok || nubefactResult.errors) {
      const errorMsg = nubefactResult.errors || JSON.stringify(nubefactResult);
      throw new Error(`Error desde Nubefact: ${errorMsg}`);
    }

    const comprobanteUrl = nubefactResult.enlace_del_pdf;
    console.log("URL de comprobante generada:", comprobanteUrl);

    if (!comprobanteUrl) {
      throw new Error("Nubefact devolvió éxito pero no se encontró 'enlace_del_pdf' en la respuesta.");
    }

    // 7. Actualizar el pedido en Supabase
    console.log("Guardando URL en la tabla 'ventas'...");
    const { error: updateError } = await supabase
      .from('ventas')
      .update({ comprobante_url: comprobanteUrl })
      .eq('id', orderId);

    if (updateError) {
      console.error("Error al actualizar la base de datos con la URL:", updateError);
      throw new Error(`Boleta generada (${comprobanteUrl}) pero falló al guardar en Supabase: ${updateError.message}`);
    }

    console.log("=== PROCESO COMPLETADO CON ÉXITO ===");

    return new Response(
      JSON.stringify({ success: true, comprobante_url: comprobanteUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );

  } catch (error: any) {
    console.error("=== ERROR EN LA EDGE FUNCTION ===");
    console.error("Mensaje de error:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Retornamos el error detallado al frontend
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
