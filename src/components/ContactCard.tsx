import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ContactCardProps = {
  name: string;
  email: string;
  source?: 'api' | 'supabase';
  onDelete?: () => void;
};

export default function ContactCard({
  name,
  email,
  source = 'api',
  onDelete,
}: ContactCardProps) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.badge}>
          {source === 'api' ? 'API JSONPlaceholder' : 'Supabase'}
        </Text>
      </View>

      {source === 'supabase' && onDelete ? (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  badge: {
    marginTop: 8,
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
