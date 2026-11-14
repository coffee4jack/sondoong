import React from "react";
import { ScrollView, Text, View } from "react-native";
import BottomNav from "./BottomNav";
import Header from "./Header";
import OrderCard from "./OrderCard";
import { styles } from "../styles";

export default function OrdersScreen({ orders, onTrack, onBack, onTab }) {
  return <View style={styles.screen}>
    <Header title="Mis pedidos" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      {orders.length === 0 ? <Text style={styles.empty}>Tus pedidos aparecerán aquí.</Text> : orders.map((order) => <OrderCard key={order.code || order.id} order={order} onTrack={onTrack} />)}
    </ScrollView>
    <BottomNav active="Pedidos" onTab={onTab} />
  </View>;
}
