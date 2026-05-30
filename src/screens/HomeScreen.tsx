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
  const [refreshingApi, setRefreshingApi] = useState(false);

  const [importingAll, setImportingAll] = useState(false);
  const [importingIds, setImportingIds] = useState<number[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchApiContacts();
    fetchDbContacts();
  }, []);

  async function fetchApiContacts(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshingApi(true);
      } else {
        setLoadingApi(true);
      }

      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: ApiUser[] = await response.json();

      setApiContacts(data);
    } catch (error) {
      console.log('Erro ao buscar API:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os contatos da API.');
    } finally {
      setLoadingApi(false);
      setRefreshingApi(false);
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

  async function handleImportSingleContact(contact: ApiUser) {
    try {
      setImportingIds((prev) => [...prev, contact.id]);

      const { error } = await supabase.from('contacts').upsert(
        {
          name: contact.name,
          email: contact.email.toLowerCase(),
        },
        {
          onConflict: 'email',
          ignoreDuplicates: true,
        }
      );

      if (error) throw error;

      await fetchDbContacts();
      Alert.alert('Sucesso', `${contact.name} foi enviado para o banco.`);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível adicionar o contato ao banco.'
      );
      console.log(error);
    } finally {
      setImportingIds((prev) => prev.filter((id) => id !== contact.id));
    }
  }

  async function handleImportAllApiContacts() {
    try {
      setImportingAll(true);

      const payload = apiContacts.map((contact) => ({
        name: contact.name,
        email: contact.email.toLowerCase(),
      }));

      const { error } = await supabase.from('contacts').upsert(payload, {
        onConflict: 'email',
        ignoreDuplicates: true,
      });

      if (error) throw error;

      await fetchDbContacts();
      Alert.alert('Sucesso', 'Todos os contatos da API foram enviados ao banco.');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível importar todos os contatos.'
      );
      console.log(error);
    } finally {
      setImportingAll(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App de Contatos</Text>
      <Text style={styles.subtitle}>API + Supabase na mesma tela</Text>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Adicionar contato manualmente</Text>

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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Usuários da API</Text>

          <TouchableOpacity
            style={[
              styles.refreshButton,
              refreshingApi && styles.buttonDisabled,
            ]}
            onPress={() => fetchApiContacts(true)}
            disabled={refreshingApi}
          >
            <Text style={styles.refreshButtonText}>
              {refreshingApi ? 'Atualizando...' : 'Atualizar contatos da API'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.importAllButton,
              (importingAll || apiContacts.length === 0) && styles.buttonDisabled,
            ]}
            onPress={handleImportAllApiContacts}
            disabled={importingAll || apiContacts.length === 0}
          >
            <Text style={styles.refreshButtonText}>
              {importingAll ? 'Importando todos...' : 'Adicionar todos ao banco'}
            </Text>
          </TouchableOpacity>
        </View>

        {loadingApi ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          apiContacts.map((item) => (
            <ContactCard
              key={`api-${item.id}`}
              name={item.name}
              email={item.email}
              source="api"
              adding={importingIds.includes(item.id)}
              onAdd={() => handleImportSingleContact(item)}
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
  sectionHeader: {
    marginBottom: 12,
    gap: 10,
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
  refreshButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  importAllButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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