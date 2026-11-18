import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, PanResponder, StatusBar, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { api } from "./src/api";
import { colors, styles } from "./src/styles";
import RolePicker from "./src/components/RolePicker";
import CourierScreen from "./src/components/CourierScreen";
import HomeScreen from "./src/components/HomeScreen";
import ProductDetailScreen from "./src/components/ProductDetailScreen";
import CartScreen from "./src/components/CartScreen";
import OrdersScreen from "./src/components/OrdersScreen";
import CustomerTrackingScreen from "./src/components/CustomerTrackingScreen";
import { isCourierLocationActive, stopCourierLocation } from "./src/locationTask";

function AppContent() {
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState("RolePicker");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [trackingToken, setTrackingToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("Centro, Tegucigalpa");
  const insets = useSafeAreaInsets();

  const mainTabs = ["Home", "Favoritos", "Orders", "Account"];
  const activeMainTab = screen === "Home" || screen === "Favoritos" || screen === "Orders" || screen === "Account" ? screen : null;
  const swipeResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_event, gesture) => Boolean(activeMainTab) && Math.abs(gesture.dx) > 32 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.3,
    onPanResponderRelease: (_event, gesture) => {
      if (!activeMainTab || Math.abs(gesture.dx) < 60) return;
      const currentIndex = mainTabs.indexOf(activeMainTab);
      const nextIndex = Math.max(0, Math.min(mainTabs.length - 1, currentIndex + (gesture.dx < 0 ? 1 : -1)));
      if (nextIndex !== currentIndex) setScreen(mainTabs[nextIndex]);
    },
  }), [activeMainTab]);

  const loadMenu = useCallback(async () => {
    try {
      const [items, cats] = await Promise.all([api("/products/"), api("/categories/")]);
      setProducts(items.filter((item) => item.available && item.stock > 0));
      setCategories(["Todos", ...cats.map((item) => item.name)]);
    } catch (error) {
      Alert.alert("Sin conexión", `No se pudo cargar el menú: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const saved = JSON.parse(await AsyncStorage.getItem("bolt-order-tokens") || "[]");
      const results = await Promise.all(saved.map(async (item) => {
        try { return { ...await api(`/tracking/${item.token}/`), tracking_token: item.token }; }
        catch { return { code: item.code, tracking_token: item.token, status: "unavailable", items: [], total: 0 }; }
      }));
      setOrders(results);
    } catch (error) {
      Alert.alert("Pedidos", error.message);
    }
  }, []);

  useEffect(() => {
    loadMenu();
    AsyncStorage.getItem("bolt-app-role").then((savedRole) => {
      if (savedRole === "customer" || savedRole === "courier") {
        setRole(savedRole);
        setScreen(savedRole === "courier" ? "Courier" : "Home");
      }
    });
  }, [loadMenu]);

  useEffect(() => {
    if (role === "customer" && screen === "Orders") loadOrders();
  }, [role, screen, loadOrders]);

  useEffect(() => {
    if (role !== "customer" || screen !== "Tracking" || !trackingToken) return undefined;
    let active = true;
    const refresh = async () => {
      try {
        const latest = await api(`/tracking/${trackingToken}/`);
        if (active) setTracking({ ...latest, tracking_token: trackingToken });
      } catch {
        // Keep showing the last received state while the network reconnects.
      }
    };
    refresh();
    const timer = setInterval(refresh, 12000);
    return () => { active = false; clearInterval(timer); };
  }, [role, screen, trackingToken]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cart]);
  const addToCart = (product) => setCart((current) => {
    const found = current.find((item) => item.id === product.id);
    return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
  });
  const changeQuantity = (product, delta) => setCart((rows) => rows.map((item) => item.id === product.id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  const toggleFavorite = (product) => setFavorites((rows) => rows.some((item) => item.id === product.id) ? rows.filter((item) => item.id !== product.id) : [...rows, product]);
  const selectRole = async (nextRole) => {
    await AsyncStorage.setItem("bolt-app-role", nextRole);
    setRole(nextRole);
    setScreen(nextRole === "courier" ? "Courier" : "Home");
  };
  const switchRole = async () => {
    const active = await isCourierLocationActive().catch(() => false);
    if (active) await stopCourierLocation();
    setRole(null);
    setScreen("RolePicker");
  };
  const openTracking = async (order) => {
    setTracking(order);
    const token = order.tracking_token;
    setTrackingToken(token);
    if (token) {
      try { setTracking({ ...await api(`/tracking/${token}/`), tracking_token: token }); }
      catch (error) { Alert.alert("Seguimiento", error.message); }
    }
    setScreen("Tracking");
  };
  const checkout = async () => {
    if (!cart.length) return;
    try {
      const order = await api("/orders/", { method: "POST", data: { items: cart.map((item) => `${item.quantity}× ${item.name}`), total, status: "new", priority: "Media", target: 30, branch: "Centro", customer_name: "Cliente móvil", delivery_address: address } });
      const saved = JSON.parse(await AsyncStorage.getItem("bolt-order-tokens") || "[]");
      saved.unshift({ token: order.tracking_token, code: order.code });
      await AsyncStorage.setItem("bolt-order-tokens", JSON.stringify(saved.slice(0, 20)));
      setCart([]);
      setTrackingToken(order.tracking_token);
      setTracking({ ...order, tracking_token: order.tracking_token });
      setScreen("Tracking");
    } catch (error) {
      Alert.alert("No se pudo crear el pedido", error.message);
    }
  };

  let content;
  if (!role || screen === "RolePicker") {
    content = <RolePicker onSelect={selectRole} />;
  } else if (role === "courier") {
    content = <CourierScreen onSwitchRole={switchRole} />;
  } else if (screen === "Home") {
    content = <HomeScreen products={products} categories={categories} category={category} setCategory={setCategory} query={query} setQuery={setQuery} loading={loading} favorites={favorites} onFavorite={toggleFavorite} onProduct={(product) => { setSelected(product); setScreen("Product"); }} onQuickAdd={addToCart} onTab={(tab) => setScreen(tab === "Pedidos" ? "Orders" : tab === "Cuenta" ? "Account" : tab)} address={address} onEditAddress={() => setScreen("Cart")} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />;
  } else if (screen === "Product") {
    content = <ProductDetailScreen product={selected} onBack={() => setScreen("Home")} onAdd={(product) => { addToCart(product); setScreen("Cart"); }} />;
  } else if (screen === "Cart") {
    content = <CartScreen cart={cart} address={address} setAddress={setAddress} total={total} onBack={() => setScreen("Home")} onChangeQuantity={changeQuantity} onAdd={addToCart} onCheckout={checkout} cartCount={cart.length} />;
  } else if (screen === "Orders") {
    content = <OrdersScreen orders={orders} onTrack={openTracking} onBack={() => setScreen("Home")} onTab={(tab) => setScreen(tab === "Cuenta" ? "Account" : tab === "Pedidos" ? "Orders" : tab)} />;
  } else if (screen === "Tracking") {
    content = <CustomerTrackingScreen order={tracking} onBack={() => setScreen("Orders")} />;
  } else if (screen === "Favoritos") {
    content = <HomeScreen products={favorites} categories={["Todos"]} category="Todos" setCategory={() => {}} query="" setQuery={() => {}} loading={false} favorites={favorites} onFavorite={toggleFavorite} onProduct={(product) => { setSelected(product); setScreen("Product"); }} onQuickAdd={addToCart} onTab={(tab) => setScreen(tab === "Pedidos" ? "Orders" : tab === "Cuenta" ? "Account" : "Home")} address={address} onEditAddress={() => setScreen("Cart")} cartCount={cart.length} />;
  } else if (screen === "Account") {
    content = <RolePicker onSelect={selectRole} />;
  } else {
    content = <RolePicker onSelect={selectRole} />;
  }

  // La franja del reloj/batería se pinta del mismo color oscuro que el header (#0a0a0a);
  // la inferior toma el color de la barra de pestañas (blanca) o del fondo de la pantalla.
  const hasBottomNav = screen === "Home" || screen === "Favoritos" || screen === "Orders";
  return <View style={styles.safe} {...(activeMainTab ? swipeResponder.panHandlers : {})}>
    <StatusBar barStyle="light-content" backgroundColor={colors.ink} />
    <ExpoStatusBar style="light" backgroundColor={colors.ink} />
    <View style={{ height: insets.top, backgroundColor: colors.ink }} />
    <View style={{ flex: 1 }}>{content}</View>
    <View style={{ height: insets.bottom, backgroundColor: role === "customer" && hasBottomNav ? colors.white : colors.pale }} />
  </View>;
}

// Keep safe-area context above every screen so status and navigation insets are valid.
export default function App() {
  return <SafeAreaProvider><AppContent /></SafeAreaProvider>;
}
