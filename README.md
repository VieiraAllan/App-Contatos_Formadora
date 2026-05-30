# App de Contatos

Aplicativo simples de contatos desenvolvido com **React Native + Expo**, consumindo a API pública do **JSONPlaceholder** para listar usuários e utilizando **Supabase** para persistir contatos cadastrados manualmente.

## 📱 Funcionalidades

- Listagem de usuários da API (`name` e `email`)
- Botão para **atualizar os contatos da API**
- Cadastro de novos contatos no **Supabase**
- Listagem de contatos salvos no banco
- Exclusão de contatos salvos no Supabase
- Estrutura organizada em **screens**, **components** e **lib**
- Controle de versão com **Git**
- Export da aplicação para versão de produção web

---

## 🚀 Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)

---

## 📂 Estrutura do projeto

```bash
app-contatos/
├─ src/
│  ├─ components/
│  │  └─ ContactCard.tsx
│  ├─ lib/
│  │  └─ supabase.ts
│  └─ screens/
│     └─ HomeScreen.tsx
├─ App.tsx
├─ .env
├─ package.json
└─ README.md
```

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd app-contatos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

> **Importante:** use apenas a **Publishable Key** do Supabase no app cliente.

### 4. Inicie o projeto

```bash
npx expo start
```

---

## 🗄️ Configuração do Supabase

No **SQL Editor** do Supabase, execute o script abaixo para criar a tabela `contacts`:

```sql
create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

grant select, insert, delete on public.contacts to anon;

create policy "anon can read contacts"
on public.contacts
for select
to anon
using (true);

create policy "anon can insert contacts"
on public.contacts
for insert
to anon
with check (true);

create policy "anon can delete contacts"
on public.contacts
for delete
to anon
using (true);
```

---

## 🌐 Consumo da API

A aplicação consome o endpoint:

```bash
https://jsonplaceholder.typicode.com/users
```

Os dados exibidos na interface são:

- `name`
- `email`

### Observação

O **JSONPlaceholder** é uma API fake para testes e prototipação. O endpoint `/users` normalmente retorna sempre os **mesmos 10 usuários**, então o botão de atualização refaz a requisição, mas os dados tendem a permanecer os mesmos.

---

## 🧠 Principais arquivos do projeto

### `src/lib/supabase.ts`
Responsável por configurar a conexão com o Supabase.

### `src/components/ContactCard.tsx`
Componente reutilizável para exibir os contatos da API e do Supabase.

### `src/screens/HomeScreen.tsx`
Tela principal da aplicação, onde ficam:
- consumo da API
- exibição dos usuários
- formulário de cadastro
- leitura e exclusão de contatos no Supabase

---

## 🏗️ Build de produção

Para gerar a versão web de produção:

```bash
npx expo export -p web
```

Após o comando, os arquivos de build serão gerados na pasta:

```bash
dist/
```

### Testar a build localmente

```bash
npx expo serve
```

---

## 🧾 Histórico de commits (exemplo)

```bash
feat: cria projeto Expo e organiza estrutura inicial
feat: consome API e exibe nome e email dos usuários
feat: integra Supabase para adicionar, listar e excluir contatos
feat: adiciona botão para atualizar contatos da API
build: gera export da aplicação para produção
```

---

## ✅ Itens atendidos da missão

- [x] Inicialização do Git e commits realizados
- [x] Criação do projeto React Native com Expo
- [x] Organização em pastas (`screens` e `components`)
- [x] Consumo da API REST com `fetch()`
- [x] Exibição de `name` e `email`
- [x] Integração com Supabase
- [x] Cadastro e listagem de contatos
- [x] Geração de build/export de produção

---

## 📸 Evidências sugeridas para apresentação

Na entrega, mostre:

1. Tela do app funcionando
2. Lista dos usuários da API
3. Cadastro de contato no Supabase
4. Exclusão de contato
5. Arquivo `.env` configurado
6. SQL da tabela `contacts`
7. Terminal com o comando `npx expo export -p web`
8. Pasta `dist/` criada
9. Histórico do Git com `git log --oneline`

---

## 👨‍💻 Autor

Projeto desenvolvido como atividade prática de **React Native + Expo + Supabase + Git**.

Se desejar, você pode editar esta seção com seu nome e link do GitHub.
