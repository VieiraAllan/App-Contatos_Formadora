import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ContactCard from '../components/ContactCard';
import { supabase } from '../lib/supabase';

type ApiUser = {
  id: number;
  name: string;
  email: string;
};

type DbContact = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
};

export default function HomeScreen() {
  const [apiContacts, setApiContacts] = useState<ApiUser[]>([]);
  const [dbContacts, setDbContacts] = useState<DbContact[]>([]);

  const [loadingApi, setLoadingApi] = useState(true);
  const [loadingDb, setLoadingDb] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchApiContacts();
    fetchDbContacts();
  }, []);

  async function fetchApiContacts() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: ApiUser[] = await response.json();
      setApiContacts(data);
    } catch (error) {
      console.log('Erro ao buscar API:', error);
    } finally {
      setLoadingApi(false);
    }
  }

  async function fetchDbContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDbContacts(data || []);
    } catch (error) {
      console.log('Erro ao buscar contatos do Supabase:', error);
    } finally {
      setLoadingDb(false);
    }
  }

  async function handleAddContact() {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validação', 'Preencha nome e e-mail.');
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setDbContacts((prev) => [data[0], ...prev]);
      }

      setName('');
      setEmail('');
      Alert.alert('Sucesso', 'Contato adicionado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível salvar.');
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteContact(id: string) {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) throw error;

      setDbContacts((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Sucesso', 'Contato removido.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o contato.');
      console.log(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App de Contatos</Text>
      <Text style={styles.subtitle}>
        Dev.: Állan R. Vieira
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Adicionar contato no Supabase</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleAddContact}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Salvando...' : 'Adicionar contato'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contatos da API</Text>

        {loadingApi ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          apiContacts.map((item) => (
            <ContactCard
              key={`api-${item.id}`}
              name={item.name}
              email={item.email}
              source="api"
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contatos salvos no Supabase</Text>

        {loadingDb ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : dbContacts.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum contato salvo ainda.</Text>
        ) : (
          dbContacts.map((item) => (
            <ContactCard
              key={item.id}
              name={item.name}
              email={item.email}
              source="supabase"
              onDelete={() => handleDeleteContact(item.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 40,
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
  formCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
});