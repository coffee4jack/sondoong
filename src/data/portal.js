const MIN = 60 * 1000;

export const makeOrder = (id, items, total, minutesAgo, target, priority, status = "new") => ({
  id,
  items,
  total,
  target,
  priority,
  status,
  enteredAt: Date.now() - minutesAgo * MIN,
});

export const initialOrders = [
  makeOrder("A23B567K", ["2× Hamburguesa clásica", "1× Papas medianas"], 285, 1, 15, "Alta"),
  makeOrder("A23C118M", ["1× Pollo frito", "2× Refresco"], 245, 3, 20, "Media"),
  makeOrder("A23A902K", ["3× Pizza personal"], 420, 12, 15, "Alta", "preparing"),
  makeOrder("A23A877T", ["1× Ensalada", "1× Sopa"], 190, 14, 25, "Baja", "preparing"),
  makeOrder("A23A640P", ["2× Hamburguesa doble"], 330, 20, 15, "Media", "ready"),
];

export const initialChats = {
  Operaciones: [
    { from: "them", text: "¿Cuánto tarda el pedido?" },
    { from: "me", text: "Estará listo en 15 min." },
  ],
  Repartidor: [{ from: "them", text: "Voy en camino al local." }],
};

export const categories = ["Hamburguesas", "Pizzas", "Bebidas", "Postres"];

export const initialProducts = [
  {
    id: 1,
    name: "Hamburguesa clásica",
    category: "Hamburguesas",
    price: 125,
    stock: 24,
    available: true,
    options: ["Sin cebolla", "Extra queso +L 15"],
    image: "",
  },
  {
    id: 2,
    name: "Hamburguesa doble",
    category: "Hamburguesas",
    price: 165,
    stock: 12,
    available: true,
    options: ["Sin cebolla"],
    image: "",
  },
  {
    id: 3,
    name: "Pizza personal",
    category: "Pizzas",
    price: 140,
    stock: 8,
    available: true,
    options: ["Extra queso +L 15"],
    image: "",
  },
  {
    id: 4,
    name: "Pollo frito",
    category: "Hamburguesas",
    price: 150,
    stock: 0,
    available: false,
    options: [],
    image: "",
  },
  {
    id: 5,
    name: "Papas medianas",
    category: "Hamburguesas",
    price: 45,
    stock: 40,
    available: true,
    options: [],
    image: "",
  },
  {
    id: 6,
    name: "Ensalada",
    category: "Pizzas",
    price: 95,
    stock: 6,
    available: true,
    options: [],
    image: "",
  },
  {
    id: 7,
    name: "Refresco",
    category: "Bebidas",
    price: 30,
    stock: 60,
    available: true,
    options: ["Sin hielo"],
    image: "",
  },
  {
    id: 8,
    name: "Brownie",
    category: "Postres",
    price: 55,
    stock: 0,
    available: false,
    options: [],
    image: "",
  },
];

export const weeklyHours = [
  ["Lun – Vie", "10:00 – 22:00"],
  ["Sábado", "10:00 – 23:00"],
  ["Domingo", "11:00 – 20:00"],
];

export const initialExceptions = [
  { id: 1, date: "2026-11-15", from: "10:00", to: "16:00", reason: "Evento privado" },
];

export const branches = ["Centro", "Norte"];
export const statuses = ["Entregado", "En curso", "Cancelado"];

export const historyRows = [
  { id: "A23B567K", date: "2026-11-03", branch: "Centro", status: "En curso", total: 285 },
  { id: "A23A640P", date: "2026-11-03", branch: "Centro", status: "Entregado", total: 330 },
  { id: "A239F118", date: "2026-11-02", branch: "Centro", status: "Entregado", total: 410 },
  { id: "A239E004", date: "2026-11-02", branch: "Norte", status: "Cancelado", total: 190 },
  { id: "A239C771", date: "2026-11-01", branch: "Norte", status: "Entregado", total: 520 },
  { id: "A2398B12", date: "2026-11-01", branch: "Centro", status: "Entregado", total: 145 },
  { id: "A2397A90", date: "2026-10-31", branch: "Centro", status: "Entregado", total: 275 },
  { id: "A2396F33", date: "2026-10-30", branch: "Norte", status: "Cancelado", total: 215 },
  { id: "A2395D02", date: "2026-10-29", branch: "Centro", status: "Entregado", total: 360 },
  { id: "A2394C58", date: "2026-10-28", branch: "Norte", status: "Entregado", total: 480 },
];

export const reportRanges = {
  Hoy: {
    sales: 3850,
    orders: 24,
    cancels: 1,
    prep: 13,
    rating: 4.8,
    reviews: 9,
    commission: 770,
    bars: [
      ["9h", 300],
      ["11h", 650],
      ["13h", 1100],
      ["15h", 500],
      ["17h", 600],
      ["19h", 700],
    ],
  },
  "7 días": {
    sales: 21400,
    orders: 138,
    cancels: 4,
    prep: 14,
    rating: 4.7,
    reviews: 52,
    commission: 4280,
    bars: [
      ["Lun", 2600],
      ["Mar", 2900],
      ["Mié", 3100],
      ["Jue", 3300],
      ["Vie", 4200],
      ["Sáb", 3800],
      ["Dom", 1500],
    ],
  },
  "30 días": {
    sales: 48250,
    orders: 312,
    cancels: 9,
    prep: 14,
    rating: 4.7,
    reviews: 185,
    commission: 9650,
    bars: [
      ["Sem 1", 10900],
      ["Sem 2", 12400],
      ["Sem 3", 11300],
      ["Sem 4", 13650],
    ],
  },
};

export const settlements = [
  {
    id: "L-2026-11A",
    period: "1 – 15 nov 2026",
    status: "Pendiente de pago",
    gross: 48250,
    commission: 9650,
    adjustments: [["Ajuste por devolución #A239E004", -320]],
  },
  {
    id: "L-2026-10B",
    period: "16 – 31 oct 2026",
    status: "Pagada",
    gross: 51200,
    commission: 10240,
    adjustments: [["Bono por tiempo de preparación", 400]],
  },
  {
    id: "L-2026-10A",
    period: "1 – 15 oct 2026",
    status: "Pagada",
    gross: 44800,
    commission: 8960,
    adjustments: [],
  },
];

export const threads = [
  {
    id: 1,
    orderId: "A23B567K",
    with: "Operaciones",
    messages: [
      { from: "them", text: "¿Cuánto tarda el pedido?" },
      { from: "me", text: "Estará listo en 15 min." },
    ],
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
