import { DollarSign, Clock, ShieldCheck, Zap } from "lucide-react"

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Locations", href: "#locations" },
  { label: "Community", href: "#community" },
  { label: "News", href: "#news" },
  { label: "Blog", href: "#blog" },
  { label: "Support", href: "#support" },
  { label: "FAQ", href: "#faq" },
]

export const journeySteps = [
  {
    title: "Registro en línea",
    description: "Crea tu cuenta en menos de 5 minutos subiendo tu identificación y documento del vehículo.",
  },
  {
    title: "Verificación de Perfil",
    description: "Validamos tus antecedentes y documentos rápidamente para garantizar la seguridad de la comunidad.",
  },
  {
    title: "Descarga la App",
    description: "Obtén acceso a la app de DriverGO, activa tu estado 'En línea' y comienza a recibir solicitudes.",
  },
  {
    title: "¡Comienza a Ganar!",
    description: "Completa entregas, recibe propinas al 100% y retira tus ganancias de forma semanal o inmediata.",
  },
]

export const features = [
  {
    icon: DollarSign,
    title: "Tarifas Transparentes",
    description: "Conoce siempre la ganancia estimada y la distancia antes de aceptar cualquier pedido.",
  },
  {
    icon: Clock,
    title: "Horarios 100% Flexibles",
    description: "Conéctate cuando quieras. Sin turnos obligatorios ni penalizaciones por inactividad.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro en Cada Viaje",
    description: "Cuentas con cobertura de seguro contra accidentes desde que aceptas un pedido hasta entregarlo.",
  },
  {
    icon: Zap,
    title: "Pagos Instantáneos",
    description: "Solicita el cobro directo de tus ganancias a tu cuenta bancaria cuando lo necesites.",
  },
]

export const faqs = [
  {
    question: "¿Qué requisitos necesito para registrarme?",
    answer: "Debes ser mayor de 18 años, contar con identificación oficial vigente, licencia de conducir acorde a tu vehículo (auto, moto o bici) y pasar la verificación de antecedentes.",
  },
  {
    question: "¿Con qué vehículos puedo hacer entregas?",
    answer: "Puedes entregar en motocicleta, automóvil, bicicleta o scooter. Elige la opción que mejor se adapte a tu ciudad.",
  },
  {
    question: "¿Cómo y cuándo recibo mis pagos?",
    answer: "Los pagos semanales se depositan automáticamente cada lunes. También dispones de la opción 'Cashout Inmediato' para retirar tus fondos en minutos.",
  },
  {
    question: "¿Me quedan las propinas completas?",
    answer: "Sí, el 100% de las propinas de los clientes van directamente a ti sin ningún tipo de comisión.",
  },
]

export const footerColumns = [
  {
    title: "Conduce",
    links: ["Requisitos", "Ciudades", "Vehículos", "Seguridad"],
  },
  {
    title: "Empresa",
    links: ["Sobre Nosotros", "Blog", "Prensa", "Comunidad"],
  },
  {
    title: "Soporte",
    links: ["Centro de Ayuda", "Términos de Servicio", "Privacidad", "Contacto"],
  },
]