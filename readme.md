# ⏳ TimeCapsule

**TimeCapsule** é uma aplicação web moderna que permite aos usuários criarem cápsulas do tempo digitais — mensagens, fotos, vídeos e arquivos que serão abertas apenas em uma data futura determinada. Ideal para guardar lembranças, promessas, mensagens para o futuro ou eventos especiais.

---

## 📌 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Uso](#instalação-e-uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 📖 Sobre o Projeto

O **TimeCapsule** surgiu como um projeto acadêmico com a proposta de unir memória afetiva, tecnologia e o conceito de tempo. Com ele, os usuários podem:

- Criar uma cápsula com conteúdo digital.
- Definir uma data futura para a abertura.
- Compartilhar ou guardar para si.
- Ser notificado quando a cápsula puder ser aberta.

---

## ✨ Funcionalidades

- 📦 Criação de cápsulas do tempo com título, descrição, conteúdo e data de desbloqueio.
- 🔒 Proteção de cápsulas com senha (opcional).
- ⏰ Contador regressivo para o desbloqueio.
- 👥 Cadastro e login de usuários com autenticação JWT.
- 🧭 Interface intuitiva para gerenciamento de cápsulas.
- 📨 Notificações por e-mail (futuro).
- 🧠 Suporte a múltiplos formatos: texto, imagem, vídeo, PDF.

---

## 🛠️ Tecnologias Utilizadas

### 💻 Frontend
- **Next.js** + **TypeScript**
- **Tailwind CSS** para estilização
- **React Hook Form** para formulários
- **Axios** para requisições HTTP

### 🧠 Backend
- **NestJS**
- **PostgreSQL** (via Prisma ORM)
- **JWT** para autenticação
- **Arquitetura limpa** baseada em camadas (Controllers, Services, Modules)

### ☁️ Outros
- **Supabase** (banco de dados e autenticação)
- **Docker** (opcional para ambiente local)
- **GitHub Actions** (CI/CD - opcional)

---

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL ou Supabase
- Git

### Clone o repositório

```bash
git clone https://github.com/TimeCapsuleFAG/TimeCapsule.git
cd TimeCapsule
