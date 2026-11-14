import React from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function TrackingMap({ point, style }) {
  if (!point) {
    return <View style={[style, { alignItems: "center", justifyContent: "center", backgroundColor: "#EDE9E0", padding: 24 }]}><Text style={{ fontSize: 32 }}>📍</Text><Text style={{ color: "#010F1C", fontWeight: "700", marginTop: 8 }}>Esperando ubicación</Text><Text style={{ color: "#667078", textAlign: "center", marginTop: 4 }}>El mapa aparecerá cuando el repartidor comparta su GPS.</Text></View>;
  }
  const coordinate = { latitude: Number(point.latitude), longitude: Number(point.longitude) };
  return <MapView style={style} initialRegion={{ ...coordinate, latitudeDelta: 0.025, longitudeDelta: 0.025 }} region={{ ...coordinate, latitudeDelta: 0.025, longitudeDelta: 0.025 }}><Marker coordinate={coordinate} title="Repartidor" description="Última ubicación compartida" /></MapView>;
}
