import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

export default function Header({ title, onBack, cartCount = 0, onCart }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back} accessibilityLabel="Volver">
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.logo}><Text style={styles.logoText}>B</Text></View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.welcome}>BOLT · COMIDA LOCAL</Text>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.cartIcon} onPress={onCart} accessibilityLabel={`Carrito, ${cartCount} productos`}>
        <Text style={styles.cartText}>🛒</Text>
        {cartCount > 0 && <Text style={styles.cartBadge}>{cartCount}</Text>}
      </TouchableOpacity>
    </View>
  );
}
