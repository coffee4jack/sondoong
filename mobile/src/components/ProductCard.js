import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { imageFor } from "../api";
import { styles } from "../styles";

export default function ProductCard({ product, onPress, onQuickAdd, favorite, onFavorite }) {
  return (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => onPress(product)} activeOpacity={0.88}>
        <Image source={{ uri: imageFor(product) }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category_name || "Favoritos locales"}</Text>
      </TouchableOpacity>
      <View style={styles.priceRow}>
        <Text style={styles.price}>L {Number(product.price).toFixed(0)}</Text>
        <TouchableOpacity onPress={() => onQuickAdd(product)} style={styles.addCircle} accessibilityLabel={`Agregar ${product.name}`}>
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onFavorite(product)} style={styles.heart} accessibilityLabel={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
        <Text>{favorite ? "♥" : "♡"}</Text>
      </TouchableOpacity>
    </View>
  );
}
