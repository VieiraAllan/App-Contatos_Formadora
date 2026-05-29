import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App de Contatos</Text>
      <Text style={styles.subtitle}>
        Estrutura inicial criada com Expo + React Native
      </Text>
      <Text style={styles.text}>
        Próximas etapas:
      </Text>
      <Text style={styles.text}>• Consumir API</Text>
      <Text style={styles.text}>• Integrar Supabase</Text>
      <Text style={styles.text}>• Gerar build</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4b5563',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1f2937',
  },
});