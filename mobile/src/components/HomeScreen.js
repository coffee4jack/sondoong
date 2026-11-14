import React from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BottomNav from "./BottomNav";
import Header from "./Header";
import Pill from "./Pill";
import ProductCard from "./ProductCard";
import { colors, styles } from "../styles";

export default function HomeScreen({ products, categories, category, setCategory, query, setQuery, loading, favorites, onFavorite, onProduct, onQuickAdd, onTab, address, onEditAddress, cartCount }) {
  const visible = products.filter((product) => (category === "Todos" || product.category_name === category) && product.name.toLowerCase().includes(query.toLowerCase()));
  return <View style={styles.screen}>
    <Header title="¿Qué se te antoja?" cartCount={cartCount} onCart={() => onTab("Cart")} />
    <View style={styles.addressBar}><Text style={styles.pin}>⌖</Text><View style={{ flex: 1 }}><Text style={styles.mutedSmall}>ENTREGAR EN</Text><Text style={styles.address}>{address}</Text></View><TouchableOpacity onPress={onEditAddress}><Text style={styles.change}>Cambiar</Text></TouchableOpacity></View>
    <View style={styles.searchBox}><Text>⌕</Text><TextInput placeholder="Buscar platillo o restaurante" value={query} onChangeText={setQuery} style={styles.searchInput} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>{categories.map((item) => <Pill key={item} active={category === item} onPress={() => setCategory(item)}>{item}</Pill>)}</ScrollView>
    <ScrollView contentContainerStyle={styles.content}><View style={styles.hero}><View style={{ flex: 1 }}><Text style={styles.heroEyebrow}>RECIÉN HECHO PARA TI</Text><Text style={styles.heroTitle}>Un antojo bien resuelto.</Text><Text style={styles.heroSub}>Pide local. Disfruta en casa.</Text></View><Text style={styles.heroEmoji}>🍔</Text></View><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Cerca de ti</Text><Text style={styles.sectionLink}>Ver todos</Text></View>{loading ? <ActivityIndicator color={colors.green} style={{ margin: 30 }} /> : <View style={styles.grid}>{visible.map((product) => <ProductCard key={product.id} product={product} onPress={onProduct} onQuickAdd={onQuickAdd} favorite={favorites.some((item) => item.id === product.id)} onFavorite={onFavorite} />)}</View>}</ScrollView>
    <BottomNav active="Inicio" onTab={onTab} />
  </View>;
}
