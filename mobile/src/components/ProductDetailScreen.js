import React from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import Header from "./Header";
import { imageFor } from "../api";
import { styles } from "../styles";

export default function ProductDetailScreen({ product, onBack, onAdd }) {
  return <>
    <Header title="Detalle del producto" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: imageFor(product || {}) }} style={styles.detailImage} />
      <Text style={styles.detailTitle}>{product?.name}</Text>
      <Text style={styles.price}>L {Number(product?.price || 0).toFixed(0)}</Text>
      <Text style={styles.detailText}>Preparado al momento con ingredientes frescos. Elige tus opciones y agrégalo al carrito.</Text>
      <Text style={styles.sectionTitle}>Opciones</Text>
      {(product?.options || []).map((item) => <Text key={item} style={styles.option}>○  {item}</Text>)}
      <TouchableOpacity style={styles.primaryButton} onPress={() => onAdd(product)}><Text style={styles.primaryText}>Agregar · L {Number(product?.price || 0).toFixed(0)}</Text></TouchableOpacity>
    </ScrollView>
  </>;
}
