# 🚀 Executando o projeto com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando irá:

1. Construir as imagens Docker definidas nos **Dockerfiles**
2. Criar os containers **FM-frontend** e **FM-backend**
3. Instalar as dependências necessárias
4. Iniciar o servidor de desenvolvimento do Angular
5. Compilar e iniciar a API em Spring Boot

---

# 🌐 Acessando a aplicação

Após a inicialização dos containers, os serviços estarão disponíveis em:

Frontend (Angular):

```
http://localhost:4200
```

Backend (Spring Boot API):

```
http://localhost:8080
```

---

# 📂 Estrutura utilizada

```
.
├── docker-compose.yml
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── angular.json
│   └── src/
│
└── backend/
    ├── Dockerfile
    ├── pom.xml
    └── src/
```

---

# 🔌 Portas

As seguintes portas são utilizadas:

| Serviço  | Porta Local | Porta do Container |
| -------- | ----------- | ------------------ |
| Frontend | 4200        | 4200               |
| Backend  | 8080        | 8080               |

---

# 📌 Observações

* O servidor Angular é executado com `--host 0.0.0.0` para permitir acesso externo ao container.
* O backend utiliza Spring Boot executado a partir do arquivo `.jar` gerado pelo Maven.
* Os containers são orquestrados utilizando **Docker Compose**.
* O ambiente está configurado principalmente para **desenvolvimento**.
