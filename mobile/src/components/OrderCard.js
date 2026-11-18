import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Pill from "./Pill";
import { styles } from "../styles";

export default function OrderCard({ order, onTrack }) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTop}>
        <Text style={styles.productName}>Pedido #{order.code || order.id}</Text>
        <Pill active>{order.status}</Pill>
      </View>
      <Text style={styles.detailText}>{(order.items || []).join(" · ")}</Text>
      <Text style={styles.price}>L {order.total}</Text>
      <TouchableOpacity style={styles.trackButton} onPress={() => onTrack(order)} accessibilityLabel={`Rastrear pedido ${order.code || order.id} por GPS`}>
        <Text style={styles.trackText}>⌖  Rastrear pedido por GPS</Text>
      </TouchableOpacity>
    </View>
  );
}
