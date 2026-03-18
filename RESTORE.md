# Restoration Guide: Eternity AI

This document provides instructions on how to restore and run the **Eternity AI** project from this repository.

## 1. Prerequisites
- **Node.js** (v18 or newer recommended)
- **Supabase Account** (for database and authentication)
- **OpenAI API Key** (or a local AI runner like LM Studio)

## 2. Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/pokernet/virtualperson.git
cd virtualperson
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a file named `.env.local` in the root directory and add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-postgresql-url

# AI Configuration
OPENAI_API_KEY=your-openai-key
AI_MODEL_PREFERENCE=openai # options: openai, local
LOCAL_AI_URL=http://localhost:1234/v1 # For LM Studio / Local AI
```

## 3. Database Setup (Supabase)

You will need to create the following tables in your Supabase project:

### Tables

#### `personas`
- `id`: uuid (primary key)
- `name`: text
- `role`: text
- `personality_traits`: text[]
- `background_story`: text
- `system_prompt`: text
- `created_at`: timestamp with time zone

#### `chats`
- `id`: uuid (primary key)
- `persona_id`: uuid (foreign key to personas.id)
- `user_id`: uuid (foreign key to auth.users.id)
- `created_at`: timestamp with time zone

#### `messages`
- `id`: uuid (primary key)
- `chat_id`: uuid (foreign key to chats.id)
- `role`: text ('user' or 'assistant')
- `content`: text
- `created_at`: timestamp with time zone

### RLS (Row Level Security)
Ensure you have RLS policies configured so that users can only access their own chats and messages (`auth.uid() = user_id`).

## 4. Running the Project

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Gravity Agent History
You can find the development history and task breakdown from the original Gravity session in the `.gravity/brain/` directory.
