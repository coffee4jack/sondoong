import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

const tabs = ["Inicio", "Favoritos", "Pedidos", "Cuenta"];
const icons = ["⌂", "♡", "▤", "◉"];

export default function BottomNav({ active, onTab }) {
  return (
    <View style={styles.bottom}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={tab} onPress={() => onTab(tab)} style={styles.navItem}>
          <Text style={[styles.navIcon, active === tab && styles.navActive]}>{icons[index]}</Text>
          <Text style={[styles.navText, active === tab && styles.navActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
