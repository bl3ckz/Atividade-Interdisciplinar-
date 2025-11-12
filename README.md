# Base de Cadastro de Usuários (Next.js + Mongoose)

Projeto exemplo usando Next.js (App Router) + TypeScript + MongoDB Atlas (Mongoose) para cadastro de usuários.

## Tecnologias
- Next.js (App Router)
- TypeScript
- MongoDB Atlas (Mongoose)
- Bcrypt para hash de senha (saltRounds = 12)
- Zod para validação

## Pré-requisitos
- Node.js 18+ (recomendado >= 18 LTS)
- Conta no MongoDB Atlas com cluster configurado

## Estrutura Principal
```
/lib/db.ts            # Conexão Mongoose com cache
/lib/validators.ts    # Validador simples de email (client)
/models/User.ts       # Modelo User
/app/api/users/register/route.ts  # Rota de cadastro
/app/page.tsx         # Página com formulário
/components/Feedback.tsx         # Componente de feedback
```

## Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto (NÃO commitar). Exemplo (coloque sua senha real onde indicado):
```
MONGODB_URI="mongodb+srv://pedrodantas9_db_user:<PASSWORD_AQUI>@multidisciplinar.bmf9suu.mongodb.net/cadastro_usuarios?retryWrites=true&w=majority&appName=Multidisciplinar"
```
Se a variável `MONGODB_URI` estiver ausente, o servidor lançará um erro claro ao iniciar.

## Instalação
Instale dependências:
```bash
npm install next react react-dom typescript @types/react @types/node --save
npm install mongoose bcrypt zod
npm install -D @types/bcrypt
```
Configure seu `tsconfig.json` conforme o template Next.js (se ainda não existir, gere com `npx create-next-app@latest`).

## Executar Localmente
```bash
npm run dev
```
Acesse: http://localhost:3000

Preencha o formulário (nome, email, senha >= 8). Ao enviar:
- Validação client simples
- Chamada POST para `/api/users/register`
- Mensagens de sucesso ou erro aparecem abaixo

## Rota de Cadastro
`POST /api/users/register`
Body JSON:
```json
{ "name": "Nome", "email": "email@exemplo.com", "password": "senhaSegura" }
```
Respostas:
- 201: `{ "success": true, "data": { "id": "...", "name": "Nome", "email": "email@exemplo.com" } }`
- 400: `{ "success": false, "error": "Mensagem de validação" }`
- 409: `{ "success": false, "error": "Email já cadastrado" }`
- 500: `{ "success": false, "error": "Erro interno do servidor" }`

## Deploy no Vercel
1. Crie o projeto no Vercel.
2. Em "Environment Variables", adicione `MONGODB_URI` com o mesmo valor usado localmente (com a senha real).
3. Verifique se o cluster Atlas permite acesso (IP Whitelist ou 0.0.0.0/0).
4. Se ocorrer erro de DNS logo após criação do cluster, aguarde alguns minutos.
5. Rotas usam `runtime = 'nodejs'` e `dynamic = 'force-dynamic'` para garantir execução no ambiente Node e evitar cache.

## Erros Comuns
- `Missing MONGODB_URI`: variável não definida no `.env.local` ou nas variáveis da Vercel.
- `MongoNetworkError`: IP não autorizado ou cluster indisponível.
- `Email já cadastrado`: usuário já existe.

## Segurança
- Nunca commite `.env.local` (adicione ao `.gitignore`).
- Senhas são armazenadas como hash `bcrypt` (saltRounds=12).
- A rota nunca retorna o `passwordHash`.

## Futuro: Rota de Login (Resumo)
Fluxo futuro para `/api/users/login` (não implementada aqui):
1. Receber `{ email, password }`.
2. Validar com Zod.
3. Buscar usuário por email.
4. `bcrypt.compare(password, user.passwordHash)`.
5. Se correto, emitir JWT (biblioteca como `jsonwebtoken`) ou integrar `NextAuth` para sessão.
6. Responder com `{ success: true, data: { id, name, email } }`.

## Modelo User
Campos: `name`, `email` (único, lowercase), `passwordHash`, timestamps.

## Conexão Mongoose
`/lib/db.ts` usa cache global para evitar múltiplas conexões em hot-reload de desenvolvimento.

## Scripts úteis (exemplo)
Adicione ao `package.json` se necessário:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Licença
Uso educacional.
