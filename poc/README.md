# 🚀 POC - Sistema de Crédito com NestJS, Prisma e RabbitMQ

Esta POC demonstra um sistema de crédito assíncrono utilizando **NestJS**, **Prisma ORM**, **RabbitMQ** e **PostgreSQL**. O sistema recebe solicitações de crédito, publica mensagens para análise em uma fila do RabbitMQ, processa a análise simulada e publica o resultado atualizado em outra fila.

## 📌 **Tecnologias Utilizadas**
- [NestJS](https://nestjs.com/) - Framework para Node.js
- [Prisma ORM](https://www.prisma.io/) - Gerenciador de banco de dados
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker para comunicação assíncrona
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- Docker & Docker Compose - Para facilitar a execução do projeto

---

## ⚙ **Instalação e Configuração**

### 1️⃣ **Clone o Repositório**
```bash
git clone https://github.com/Jwmffreitas/SistemaDeCredito-Trampay
cd SistemaDeCredito-Trampay
```

## 🐳 **Rodando com Docker**

A maneira mais fácil de rodar a POC é utilizando o **Docker Compose**:

```bash
docker-compose up --build
```

Isso iniciará:

-   O **Backend NestJS** na porta `3000`
-   O **Microserviço Adapter NestJS** na porta `3001`
-   O **RabbitMQ** na porta `5672` (com painel em `http://localhost:15672`)
-   O **PostgreSQL** na porta `5432`

Caso precise acessar o banco pelo terminal:

```bash
docker exec -it postgres psql -U user -d creditdb

```

----------

## 🛠 **Rodando Localmente (Sem Docker)**

Se preferir rodar localmente, siga os passos:

### 1️⃣ **Instale as dependências**

```bash
npm install
```

### 2️⃣ **Suba o PostgreSQL e RabbitMQ Manualmente**

Caso não utilize Docker, é necessário rodar o PostgreSQL e RabbitMQ na sua máquina.

### 3️⃣ **Execute as Migrações do Prisma**

```bash
npx prisma migrate dev
```

### 4️⃣ **Inicie o Servidor**

```bash
npm run start
```

----------

## ⚙ **Arquitetura do Projeto**

O projeto segue uma abordagem modular utilizando NestJS com **Prisma ORM** para persistência e **RabbitMQ** para comunicação assíncrona.

### 📌 **Fluxo da Aplicação**

1.  O usuário faz uma **requisição de crédito** (via `POST /credit/apply`).
2.  A solicitação é salva no **PostgreSQL** e enviada para a exchange `creditRequest` no **RabbitMQ**.
3.  O serviço de **análise de crédito** consome essa mensagem, **simula a análise**, atribui um status aleatório (`APROVADO` ou `NEGADO`).
4.  A solicitação processada é enviada para a exchange `creditAnalyses`.
5.  Outros serviços podem consumir essa exchange fila para tomada de decisão.

### 🏗 **Estrutura de Pastas**

```
📂 src
 ├── application
 │   ├── creditRequest 	    # Contexto de requisição de crédito
 |   │   ├── services       # Lógica de negócios
 |   │   ├── handlers       # Casos de uso
 |   │   ├── commands       # Objetos de comando para CQRS
 │   ├── creditStatus 	    # Contexto do status de crédito
 |   │   ├── services       # Lógica de negócios
 |   │   ├── handlers       # Casos de uso
 |   │   ├── commands       # Objetos de comando para CQRS
 ├── domain                 # Entidades e repositórios abstratos
 ├── infrastructure
 │   ├── postgres           # Prisma e repositórios de banco
 │   ├── rabbitmq           # Conexão com RabbitMQ
 ├── presentation
 │   ├── creditRequest      # Contexto de apresentação da requisição de crédito
 |   │   ├── controllers    # Rotas HTTP do NestJS
 |   │   ├── dtos           # Validação
 │   ├── creditStatus       # Contexto de apresentação do status do crédito
 |   │   ├── controllers    # Rotas HTTP do NestJS
 |   │   ├── dtos           # Validação
 ├── prisma                 # Schema do banco
 ├── main.ts                # Ponto de entrada do NestJS

```

----------

## 📡 **Testando a API**

### **Criar Solicitação de Crédito**

```bash
curl -X POST http://localhost:3000/credit/apply\
     -H "Content-Type: application/json" \
     -d '{"userId": "123", "amount": 5000, "reason": ""}'
```

### **Verificar Status de Crédito**

```bash
curl -X GET http://localhost:3000/credit/status/123
```

----------

## 🛠 **Comandos Úteis**

### 🔄 **Reiniciar Banco de Dados**

```bash
npx prisma migrate reset
```

### 🐇 **Acompanhar Mensagens no RabbitMQ**

```bash
docker logs -f rabbitmq
```

----------

## 📜 **Licença**

Este projeto é open-source sob a licença **MIT**.
