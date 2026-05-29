import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ContactCard from '../components/ContactCard';

type User = {
  id: number;
  name: string;
  email: string;
};

export default function HomeScreen() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: User[] = await response.json();
      setContacts(data);
    } catch (error) {
      console.log('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App de Contatos</Text>
      <Text style={styles.subtitle}>
        Lista de usuários consumida da API
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        contacts.map((item) => (
          <ContactCard
            key={item.id}
            name={item.name}
            email={item.email}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#4b5563',
  },
});