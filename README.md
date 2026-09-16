# Executando o projeto com Docker

Este guia prepara o ambiente completo da aplicação: frontend, API, MySQL e Adminer. Na primeira inicialização, o banco recebe automaticamente a estrutura e os dados de demonstração presentes em `mysql-init/`.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução (inclui Docker Compose).
- Git, caso o projeto ainda não tenha sido baixado.

Confirme a instalação antes de continuar:

```bash
docker --version
docker compose version
```

## Baixar e configurar

Clone o repositório e entre no diretório `system`:

```bash
git clone git@github.com:flowmanagersystem-ui/flow-manager.git
cd <DIRETORIO_DO_REPOSITORIO>/system
```

Se você já baixou o código, abra um terminal na pasta que contém o arquivo `docker-compose.yml`.

O arquivo `.env` contém a configuração utilizada pelos containers. Os valores padrão são:

```env
DATABASE=flow_manager
BASE_URL=jdbc:mysql://database:3306/${DATABASE}
DB_USERNAME=root
DB_PASSWORD=rootpassword
JWT_SECRET=flow-manager-dev-secret-key-with-at-least-32-chars
```

## Iniciar

Na raiz deste diretório, execute:

```bash
docker compose up -d --build
```

O comando cria as imagens, inicia os containers e aguarda o MySQL ficar saudável antes de iniciar a API. Na primeira execução também é criado o volume `db-data` e os arquivos de `mysql-init/` são executados para criar e popular o banco.

Para acompanhar a inicialização:

```bash
docker compose logs -f
```

Interrompa o acompanhamento com `Ctrl+C`; os containers continuarão em execução. Para parar o ambiente:

```bash
docker compose down
```

## Acessos

| Serviço | Endereço |
| --- | --- |
| Aplicação web | http://localhost:4200 |
| API Spring Boot | http://localhost:8080 |

## Usuários de demonstração

As senhas no banco são armazenadas com hash. Os scripts de carga registram a senha de texto correspondente em comentários, apenas para uso local de demonstração. Após a primeira subida dos containers, use um dos exemplos abaixo para entrar na aplicação:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@email.com` | `root` |
| Cliente | `alice@email.com` | `senha123` |
| Profissional | `dayana@salao.com` | `senha456` |

Os demais usuários e suas senhas de demonstração podem ser consultados nos comentários de `mysql-init/03-data.sql`.

## Recriar os dados de demonstração

Os scripts de `mysql-init/` só são aplicados quando o volume do MySQL ainda não existe. Portanto, reiniciar os containers não recria nem altera os dados atuais.

Para apagar o banco local, o volume e recriá-los com os dados iniciais, execute:

```bash
docker compose down -v
docker compose up -d --build
```

> Atenção: `docker compose down -v` remove permanentemente os dados locais armazenados no banco.

## Estrutura Docker

```text
.
├── docker-compose.yml
├── .env
├── mysql-init/          # esquema, restrições e dados iniciais do MySQL
├── frontend/            # aplicação Angular
└── backend/             # API Spring Boot
```

O ambiente é destinado principalmente ao desenvolvimento local.
