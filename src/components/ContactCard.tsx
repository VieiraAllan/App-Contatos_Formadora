import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ContactCardProps = {
  name: string;
  email: string;
  source?: 'api' | 'supabase';
  onDelete?: () => void;
  onAdd?: () => void;
  adding?: boolean;
};

export default function ContactCard({
  name,
  email,
  source = 'api',
  onDelete,
  onAdd,
  adding = false,
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

      {source === 'api' && onAdd ? (
        <TouchableOpacity
          style={[styles.addButton, adding && styles.buttonDisabled]}
          onPress={onAdd}
          disabled={adding}
        >
          <Text style={styles.actionText}>
            {adding ? 'Adicionando...' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {source === 'supabase' && onDelete ? (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.actionText}>Excluir</Text>
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
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});