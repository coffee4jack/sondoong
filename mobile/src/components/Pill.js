import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";

export default function Pill({ children, active = false, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
}
