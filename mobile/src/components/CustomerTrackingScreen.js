import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "./Header";
import TrackingMap from "../TrackingMap";
import { styles } from "../styles";

export default function CustomerTrackingScreen({ order, onBack }) {
  return <View style={styles.screen}>
    <Header title="Seguimiento GPS" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <TrackingMap point={order?.latest_location} style={styles.map} />
      <Text style={styles.sectionTitle}>Pedido #{order?.code || order?.id}</Text>
      <Text style={styles.detailText}>Estado: {order?.status || "Confirmando"}</Text>
      <View style={styles.timeline}><Text style={styles.timelineDone}>✓ Pedido recibido</Text><Text style={styles.timelineItem}>• Preparación del pedido</Text><Text style={styles.timelineItem}>• En camino a tu dirección</Text></View>
      <Text style={styles.trackHint}>El mapa se actualiza automáticamente cada 12 segundos.</Text>
    </ScrollView>
  </View>;
}
