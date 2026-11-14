import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";
import { api } from "../api";
import { isCourierLocationActive, startCourierLocation, stopCourierLocation } from "../locationTask";
import Pill from "./Pill";
import { colors, styles } from "../styles";

export default function CourierScreen({ onSwitchRole }) {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const rows = await api("/orders/");
      const activeOrders = rows.filter((order) => ["ready", "preparing"].includes(order.status));
      setOrders(activeOrders);
      setSelected((current) => current ? activeOrders.find((order) => order.db_id === current.db_id) || current : activeOrders.find((order) => order.status === "ready") || activeOrders[0] || null);
      setError("");
    } catch (err) {
      setError(`No se pudieron cargar las entregas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    isCourierLocationActive().then(setActive).catch(() => setActive(false));
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [load]);

  const begin = async () => {
    if (!selected?.db_id) return;
    try {
      const order = { db_id: selected.db_id, code: selected.code || selected.id };
      await AsyncStorage.setItem("bolt-courier-active-order", JSON.stringify(order));
      await startCourierLocation(order);
      setActive(true);
      setNotice(`Compartiendo GPS del pedido #${order.code}. La ubicación se actualizará aunque minimices la app.`);
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo iniciar el GPS.");
    }
  };

  const stop = async () => {
    try {
      await stopCourierLocation();
      setActive(false);
      setNotice("Seguimiento GPS detenido.");
    } catch (err) {
      setError(err.message);
    }
  };

  const markDelivered = async () => {
    if (!selected?.db_id) return;
    try {
      await api(`/orders/${selected.db_id}/`, { method: "PATCH", data: { status: "delivered" } });
      await stopCourierLocation();
      setActive(false);
      setOrders((rows) => rows.filter((order) => order.db_id !== selected.db_id));
      setSelected(null);
      setNotice("Pedido marcado como entregado.");
    } catch (err) {
      setError(`No se pudo finalizar la entrega: ${err.message}`);
    }
  };

  return <View style={styles.screen}>
    <Header title="Modo repartidor" onBack={onSwitchRole} />
    <View style={styles.courierToolbar}><Text style={styles.courierIntro}>Entregas activas</Text><TouchableOpacity onPress={onSwitchRole}><Text style={styles.change}>Cambiar modo</Text></TouchableOpacity></View>
    {error ? <Text accessibilityRole="alert" style={styles.courierError}>{error}</Text> : null}
    {notice ? <Text accessibilityRole="alert" style={styles.courierNotice}>{notice}</Text> : null}
    {loading ? <ActivityIndicator color={colors.green} style={{ margin: 28 }} /> : <ScrollView contentContainerStyle={styles.content}>
      {orders.length === 0 ? <View style={styles.emptyCourier}><Text style={{ fontSize: 34 }}>🛵</Text><Text style={styles.productName}>No hay entregas activas</Text><Text style={styles.roleSubtitle}>Vuelve a revisar en unos segundos.</Text></View> : <>
        <Text style={styles.fieldLabel}>PEDIDOS PREPARÁNDOSE O LISTOS</Text>
        {orders.map((order) => <TouchableOpacity key={order.db_id} onPress={() => { if (!active) setSelected(order); }} style={[styles.courierOrder, selected?.db_id === order.db_id && styles.courierOrderSelected]}><View style={styles.orderTop}><Text style={styles.productName}>#{order.code || order.id}</Text><Pill active={order.status === "ready"}>{order.status === "ready" ? "Listo" : "Preparando"}</Pill></View><Text style={styles.detailText}>{(order.items || []).join(" · ")}</Text><Text style={styles.price}>L {order.total}</Text></TouchableOpacity>)}
        {selected && <View style={styles.courierActions}><Text style={styles.sectionTitle}>Entrega #{selected.code || selected.id}</Text><Text style={styles.detailText}>Al iniciar GPS, el cliente y el portal verán la posición actualizada durante el recorrido.</Text><TouchableOpacity onPress={active ? stop : begin} style={[styles.primaryButton, active && { backgroundColor: colors.ink }]}><Text style={[styles.primaryText, active && { color: colors.white }]}>{active ? "Detener seguimiento GPS" : "Iniciar seguimiento GPS"}</Text></TouchableOpacity>{active && <View style={styles.gpsLive}><View style={styles.gpsDot} /><Text style={styles.gpsLiveText}>GPS EN VIVO · compartiendo ubicación</Text></View>}<TouchableOpacity onPress={markDelivered} style={styles.deliveredButton}><Text style={styles.deliveredText}>Marcar como entregado</Text></TouchableOpacity></View>}
      </>}
    </ScrollView>}
  </View>;
}
