import React from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../styles";

export default function Field({ label, ...inputProps }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...inputProps} style={styles.input} />
    </View>
  );
}
