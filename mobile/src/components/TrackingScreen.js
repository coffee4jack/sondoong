import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "./Header";
import TrackingMap from "../TrackingMap";
import { styles } from "../styles";

export default function TrackingScreen({ order, onBack }) {
  return (
    <>
      <Header title="Seguimiento GPS" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <TrackingMap point={order?.latest_location} style={styles.map} />
        <View style={styles.trackingInfo}>
          <Text style={styles.sectionTitle}>Pedido #{order?.code || order?.id}</Text>
          <Text style={styles.detailText}>Estado: {order?.status || "Confirmando"}</Text>
          {order?.latest_location ? (
            <Text style={styles.locationUpdated}>
              Última ubicación recibida: {new Date(order.latest_location.recorded_at).toLocaleTimeString()}
            </Text>
          ) : (
            <Text style={styles.detailText}>El repartidor aún no ha compartido su ubicación.</Text>
          )}
        </View>
        <View style={styles.timeline}>
          <Text style={styles.timelineDone}>✓ Pedido recibido</Text>
          <Text style={styles.timelineItem}>• Preparación del pedido</Text>
          <Text style={styles.timelineItem}>• En camino a tu dirección</Text>
        </View>
        <Text style={styles.trackHint}>El mapa consulta actualizaciones automáticamente cada 12 segundos.</Text>
      </ScrollView>
    </>
  );
}
