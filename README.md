# per_vendedor_ia

Maqueta comercial del **Vendedor IA Local** para atención asistida por WhatsApp.

## Objetivo

Simular el flujo completo de una venta conversacional:

1. Cliente escribe o envía audio por WhatsApp.
2. IA local en M6 interpreta la necesidad.
3. Consulta stock, sucursal y precio.
4. Recomienda producto y confirma intención de compra.
5. Genera nota de venta y reserva simulada.
6. Cliente retira y paga en tienda.
7. El sistema puede escalar a un vendedor humano.

## Arquitectura representada

`WhatsApp → Gateway → Vendedor IA local M6 → APIs de negocio → Tienda`

La maqueta es estática y no contiene credenciales, secretos ni conexiones productivas.

## Publicación

Diseñado para GitHub Pages desde `main`. No usa ni despliega en Forestín Forge.
