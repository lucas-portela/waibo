# Waibo - Aplicação de Chat com IA

Uma aplicação completa de chat que integra WhatsApp com inteligência artificial, desenvolvida seguindo a risca Clean Architecture, princípios SOLID e um pouquinho de Hexagonal Architecture para conectar os layers da aplicação.

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend**: Next.js com @MUI/Joy
- **Backend**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL
- **Fila de Mensagens**: RabbitMQ
- **IA**: Integração com OpenAI
- **WhatsApp**: Integração via biblioteca Baileys
- **Containerização**: Docker Compose

### Arquitetura do Backend

O backend segue os princípios do **Domain Driven Design (DDD)** e **Clean Architecture**, implementando também o padrão **Hexagonal (Ports & Adapters)** para garantir baixo acoplamento e alta coesão.

```
backend/src/
├── core/           # Utilitários e erros base
├── domain/         # Entidades de domínio e regras de negócio
├── application/    # Casos de uso e serviços de aplicação
├── infra/          # Adaptadores de infraestrutura (plug & play)
└── http/           # Controladores e interface web (REST API)
```

#### Princípios Seguidos

- ✅ **Clean Architecture**: Dependências apontam sempre para dentro
- ✅ **SOLID Principles**: Código extensível e maintível
- ✅ **Ports & Adapters**: Módulos de infraestrutura completamente intercambiáveis
- ✅ **Domain Driven Design**: Foco no domínio e regras de negócio

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js (para comandos de desenvolvimento)

### Passo a Passo

1. **Clone o repositório e navegue até a pasta**
   ```bash
   git clone <repository-url>
   cd waibo
   ```

2. **Execute a aplicação com Docker Compose**
   ```bash
   docker compose --profile=dev up
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:
   ```env
   DATABASE_URL="postgresql://root:root@localhost:5432/waibo?schema=public"
   OPENAI_API_KEY="sua-chave-openai-aqui"
   ```

4. **Execute o seed do banco de dados**
   ```bash
   cd backend
   npm run seed:prisma
   ```

### Acessos

Após a execução completa:

- **Interface Web**: http://localhost:3000
- **Documentação da API (Swagger)**: http://localhost:3001

## 📚 Estrutura dos Módulos

### Frontend (web-ui/)

- **Framework**: Next.js com TypeScript
- **UI Library**: @MUI/Joy
- **Estrutura**:
  - `src/app/`: Páginas da aplicação (App Router)
  - `src/components/`: Componentes reutilizáveis
  - `src/lib/`: Utilitários e configurações

### Backend (backend/)

#### Core (`src/core/`)
Utilitários base e definições de erro da aplicação.

#### Domain (`src/domain/`)
Entidades de domínio puras, sem dependências externas:
- `user/`: Entidades relacionadas aos usuários
- `bot/`: Entidades dos bots de IA
- `chat/`: Entidades de conversas

#### Application (`src/application/`)
Casos de uso e serviços de aplicação:
- `auth/`: Autenticação e autorização
- `bot/`: Lógica dos bots de IA
- `chat/`: Gerenciamento de conversas
- `queue/`: Processamento de filas
- `user/`: Gerenciamento de usuários

#### Infrastructure (`src/infra/`)
**Módulos Plug & Play** - Adaptadores de infraestrutura:
- `crypto/`: Serviços de criptografia
- `db/`: Acesso ao banco de dados (Prisma)
- `language-model/`: Integração com OpenAI
- `message-channel/`: Integração com WhatsApp (Baileys)
- `queue/`: Implementação de filas (RabbitMQ)

#### HTTP (`src/http/`)
Controladores REST API organizados por domínio.

## 🔧 Arquitetura Plug & Play

### Como Adicionar um Novo Módulo de Infraestrutura

1. **Crie o módulo** em `src/infra/novo-modulo/`
2. **Implemente as interfaces** definidas nos ports
3. **Decore com `@Global()`** do NestJS
4. **Adicione ao `app.module.ts`**:
   ```typescript
   @Module({
     imports: [
       // outros módulos...
       NovoModuloModule,
     ],
   })
   export class AppModule {}
   ```

### Como Desabilitar um Módulo

Simplesmente comente a importação no `app.module.ts`:

```typescript
@Module({
  imports: [
    // outros módulos...
    // NovoModuloModule, // <- Comentado = Desabilitado
  ],
})
export class AppModule {}
```

## 📋 Comandos Úteis

### Backend
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev

# Executar migrações do banco
npm run prisma:migrate

# Executar seed
npm run seed:prisma

# Gerar cliente Prisma
npm run prisma:generate
```

### Frontend
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔒 Autenticação

A aplicação inclui um sistema de autenticação completo:
- Login de usuários
- Controle de roles (Admin, User)
- Proteção de rotas
- Tokens JWT

O seed inicial cria uma conta de administrador para primeiros acessos.

## 🤖 Integração com IA

- **OpenAI GPT**: Para geração de respostas inteligentes
- **Configuração flexível**: Diferentes prompts por bot
- **Memória de contexto**: Mantém histórico das conversas

## 📱 Integração WhatsApp

- **Baileys Library**: Biblioteca robusta para WhatsApp Web
- **Gestão de sessões**: Persistência de conexões
- **Suporte a mídias**: Texto, imagens, documentos
- **Webhooks**: Processamento assíncrono de mensagens

## 🏗️ Benefícios da Arquitetura

1. **Testabilidade**: Camadas isoladas facilitam testes unitários
2. **Manutenibilidade**: Código organizado e com responsabilidades bem definidas
3. **Extensibilidade**: Fácil adição de novos recursos
4. **Flexibilidade**: Troca de implementações sem afetar outras camadas
5. **Escalabilidade**: Arquitetura preparada para crescimento

## 📝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Siga os padrões de arquitetura estabelecidos
4. Adicione testes para novas funcionalidades
5. Submeta um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

```
MIT License

Copyright (c) 2024 Lucas Portela

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Desenvolvido com ❤️ seguindo as melhores práticas de arquitetura de software**
