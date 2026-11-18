export const initialChats = {
  Operaciones: [
    { from: "them", text: "¿Cuánto tarda el pedido?" },
    { from: "me", text: "Estará listo en 15 min." },
  ],
  Repartidor: [{ from: "them", text: "Voy en camino al local." }],
};

export const threads = [
  {
    id: 1,
    orderId: "A23B567K",
    with: "Operaciones",
    messages: initialChats.Operaciones,
  },
  {
    id: 2,
    orderId: "A23A640P",
    with: "Repartidor",
    messages: [{ from: "them", text: "Ya estoy en la puerta." }],
  },
  {
    id: 3,
    orderId: "A239F118",
    with: "Operaciones",
    messages: [
      { from: "me", text: "Falta confirmar el reembolso." },
      { from: "them", text: "Lo revisamos hoy." },
    ],
  },
];
