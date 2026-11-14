import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors, styles } from "../styles";

export default function RolePicker({ onSelect }) {
  return (
    <View style={[styles.screen, { justifyContent: "center", padding: 24 }]}>
      <View style={styles.logo}><Text style={styles.logoText}>B</Text></View>
      <Text style={[styles.sectionTitle, { fontSize: 27, marginTop: 20 }]}>¿Cómo usarás Bolt?</Text>
      <Text style={styles.detailText}>Elige tu modo. Puedes cambiarlo luego desde Cuenta.</Text>
      <TouchableOpacity style={styles.roleCard} onPress={() => onSelect("customer")}>
        <Text style={styles.roleIcon}>🍔</Text><View style={{ flex: 1 }}><Text style={styles.productName}>Quiero pedir</Text><Text style={styles.roleSubtitle}>Explora, compra y sigue tu entrega por GPS.</Text></View><Text style={styles.roleArrow}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.roleCard, { borderColor: colors.green }]} onPress={() => onSelect("courier")}>
        <Text style={styles.roleIcon}>🛵</Text><View style={{ flex: 1 }}><Text style={styles.productName}>Soy repartidor</Text><Text style={styles.roleSubtitle}>Selecciona una entrega y comparte tu ubicación.</Text></View><Text style={styles.roleArrow}>›</Text>
      </TouchableOpacity>
      <Text style={styles.roleNote}>El modo repartidor requiere permisos de ubicación y acceso autorizado a pedidos.</Text>
    </View>
  );
}
