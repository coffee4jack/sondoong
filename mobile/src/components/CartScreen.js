import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "./Header";
import Field from "./Field";
import { imageFor } from "../api";
import { styles } from "../styles";

export default function CartScreen({ cart, address, setAddress, total, onBack, onChangeQuantity, onAdd, onCheckout, cartCount }) {
  return <View style={styles.screen}>
    <Header title="Tu carrito" onBack={onBack} cartCount={cartCount} onCart={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      {cart.length === 0 ? <Text style={styles.empty}>Tu carrito está vacío. Explora el menú para empezar.</Text> : cart.map((item) => <View key={item.id} style={styles.cartRow}><Image source={{ uri: imageFor(item) }} style={styles.cartImage} /><View style={{ flex: 1 }}><Text style={styles.productName}>{item.name}</Text><Text style={styles.price}>L {Number(item.price) * item.quantity}</Text></View><View style={styles.quantity}><TouchableOpacity onPress={() => onChangeQuantity(item, -1)}><Text>−</Text></TouchableOpacity><Text>{item.quantity}</Text><TouchableOpacity onPress={() => onAdd(item)}><Text>＋</Text></TouchableOpacity></View></View>)}
      <Field label="Dirección de entrega" value={address} onChangeText={setAddress} />
      <View style={styles.totalRow}><Text>Total</Text><Text style={styles.price}>L {total.toFixed(2)}</Text></View>
      {cart.length > 0 && <TouchableOpacity style={styles.primaryButton} onPress={onCheckout}><Text style={styles.primaryText}>Confirmar pedido</Text></TouchableOpacity>}
    </ScrollView>
  </View>;
}
