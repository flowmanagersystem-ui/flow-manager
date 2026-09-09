# Matriz de Rastreabilidade de Requisitos

**Sistema:** Flow Manager  
**Fonte dos requisitos:** `requisitos_consolidados.md`  
**Método:** inspeção estática do código-fonte de frontend Angular e backend Spring Boot. Não foram executados testes, nem a aplicação.  
**Data da análise:** 09/09/2026

## Legenda

- **Implementado:** há evidência de implementação no código para o requisito.
- **Parcial:** há implementação, mas uma limitação de código impede ou fragiliza parte do requisito.
- **Não implementado:** não foi encontrada implementação suficiente para atender ao requisito.
- As referências apontam para arquivos e elementos de código; elas não comprovam o comportamento em execução.

## Requisitos funcionais

| ID | Requisito resumido | Situação | Evidência estática | Observações |
| --- | --- | --- | --- | --- |
| RF001 | Exibir login sem sessão autenticada | Implementado | `frontend/src/app/core/auth/auth.guard.ts`; `frontend/src/app/app.routes.ts` | `authGuard` envia quem não possui token para `/login`. |
| RF002 | Login por e-mail e senha | Implementado | `frontend/src/app/core/auth/login/login-form.component.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/auth/AuthController.java` | Formulário envia e-mail/senha a `POST /api/auth/login`. |
| RF003 | Controlar acesso por credenciais | Implementado | `backend/src/main/java/br/edu/ifba/flowmanager/config/SecurityConfig.java`; `backend/src/main/java/br/edu/ifba/flowmanager/auth/AuthService.java` | Spring Security/JWT autentica credenciais e aplica regras por perfil. |
| RF004 | Redirecionar conforme tipo após autenticação | Implementado | `frontend/src/app/core/auth/login/login-form.component.ts`; `frontend/src/app/core/auth/auth.service.ts` | `rotaInicialPorPerfil` direciona ADMIN, PROFISSIONAL e CLIENTE às agendas correspondentes. |
| RF005 | Encerrar sessão | Implementado | `frontend/src/app/core/auth/auth.service.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/auth/AuthController.java` | Frontend remove tokens e chama logout; backend inclui token na blocklist. |
| RF006 | Auto cadastro de cliente | Implementado | `frontend/src/app/core/auth/cadastro-form/cadastro-form.component.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/auth/AuthService.java` | Cadastro público cria cliente e retorna sessão autenticada. |
| RF007 | Administrador editar cliente | Implementado | `frontend/src/app/features/clientes/containers/clientes/clientes.component.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/modules/cliente/ClienteController.java` | Diálogo de edição e `PATCH /api/clientes/{id}`; rota protegida para ADMIN. |
| RF008 | Administrador excluir cliente | Implementado | `frontend/src/app/features/clientes/containers/clientes/clientes.component.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/modules/cliente/ClienteController.java` | Confirmação de exclusão e `DELETE /api/clientes/{id}`; rota protegida para ADMIN. |
| RF009 | Administrador cadastrar serviço | Implementado | `frontend/src/app/features/servicos/containers/servicos/servicos.component.ts`; `backend/src/main/java/br/edu/ifba/flowmanager/modules/servico/ServicoController.java` | Formulário de criação e `POST /api/servicos`, restrito a ADMIN. |
| RF010 | Administrador editar serviço | Implementado | `frontend/src/app/features/servicos/containers/servicos/servicos.component.ts`; `ServicoController.java` | Diálogo de edição e `PATCH /api/servicos/{id}`. |
| RF011 | Administrador excluir serviço | Implementado | `frontend/src/app/features/servicos/containers/servicos/servicos.component.ts`; `ServicoController.java` | Confirmação e `DELETE /api/servicos/{id}`. |
| RF012 | Listar e filtrar serviços | Implementado | `frontend/src/app/features/servicos/containers/servicos/servicos.component.ts`; `ServicoController.java`; `ServicoService.java` | UI filtra por nome; API também aceita `nome` e `categoria`. |
| RF013 | Definir valor de serviço | Implementado | `backend/src/main/java/br/edu/ifba/flowmanager/modules/servico/dto/ServicoRequestDTO.java`; `ServicoService.java` | O DTO contém valor e o serviço persiste `dto.valor()`. |
| RF014 | Administrador cadastrar profissional | Implementado | `frontend/src/app/features/profissionais/containers/profissionais/profissionais.component.ts`; `ProfissionalController.java` | Formulário de criação e `POST /api/profissionais`, restrito a ADMIN. |
| RF015 | Administrador editar profissional | Implementado | `frontend/src/app/features/profissionais/containers/profissionais/profissionais.component.ts`; `ProfissionalController.java` | Diálogo de edição e `PATCH /api/profissionais/{id}`. |
| RF016 | Administrador excluir profissional | Implementado | `frontend/src/app/features/profissionais/containers/profissionais/profissionais.component.ts`; `ProfissionalController.java` | Ação de remoção e `DELETE /api/profissionais/{id}`. |
| RF017 | Listar e filtrar profissionais | Implementado | `frontend/src/app/features/profissionais/containers/profissionais/profissionais.component.ts`; `ProfissionalController.java`; `ProfissionalService.java` | A tela pesquisa e a API recebe `filtro` paginado. |
| RF018 | Adicionar horário de atendimento | Implementado | `frontend/src/app/features/profissionais/containers/profissionais-horarios/horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Há diálogo e `POST /api/profissionais/{id}/horarios`; backend valida intervalo e conflito. |
| RF019 | Remover horário de atendimento | Implementado | `horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Ação de remoção e `DELETE /api/profissionais/{id}/horarios/{id}`. |
| RF020 | Editar horário de atendimento | Implementado | `horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Atualização por `PATCH` e verificação de conflito. |
| RF021 | Vincular serviços a profissional | Implementado | `frontend/src/app/features/profissionais/containers/profissional-servicos/profissional-servicos-dialog.component.ts`; `ProfissionalController.java` | Endpoints de inclusão/remoção de vínculos e diálogo administrativo. |
| RF022 | Cliente selecionar data/hora no agendamento | Parcial | `agendamentos-servicos.component.ts`; `AgendaController.java`; `SecurityConfig.java` | O seletor carrega dias e slots livres, mas a tela do cliente chama `GET /api/clientes/me` e esta URL é bloqueada para CLIENTE pela regra GET de `/api/clientes/**`. O fluxo não se completa para o cliente. |
| RF023 | Cliente selecionar serviço no agendamento | Parcial | `agendamentos-servicos.component.ts`; `ServicoController.java`; `SecurityConfig.java` | A seleção existe e clientes podem ler serviços, porém o mesmo bloqueio de `/api/clientes/me` interrompe a criação pela UI. |
| RF024 | Cliente selecionar profissional no agendamento | Parcial | `agendamentos-servicos.component.ts`; `ProfissionalController.java`; `SecurityConfig.java` | A seleção por serviço existe e clientes podem ler profissionais, porém o formulário falha ao carregar o próprio cliente. |
| RF025 | Cliente remarcar agendamento | Não implementado | `cliente-agenda.component.ts`; `SecurityConfig.java`; `AgendamentoController.java` | A UI do cliente só oferece cancelar. `PATCH /api/agendamentos/{id}` é permitido apenas a ADMIN; não há endpoint/fluxo de remarcação para CLIENTE. |
| RF026 | Administrador selecionar cliente ao criar agendamento | Implementado | `agendamento-form.component.ts`; `AgendamentoService.java` | Formulário exige cliente para ADMIN e backend usa `clienteId`. |
| RF027 | Administrador selecionar data/hora ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `AgendaController.java` | O diálogo de serviço apresenta dias/slots e forma `dataHoraInicio`. |
| RF028 | Administrador selecionar serviço ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `ServicoController.java` | Lista de serviços e `servicoId` no payload. |
| RF029 | Administrador selecionar profissional ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `ServicoController.java` | Profissionais são carregados por serviço e `profissionalId` segue no payload. |
| RF030 | Administrador inserir desconto | Implementado | `agendamento-form.component.ts`; `AgendamentoService.java` | Campo `desconto` é enviado e abatido do valor total, limitado ao mínimo zero. |
| RF031 | Admin/profissional ver agenda em modos e com filtros | Parcial | `admin-agenda.component.ts`; `profissional-agenda.component.ts`; `AgendaService.java` | ADMIN possui mês/semana/dia e filtros de profissional/status. PROFISSIONAL possui semana/dia, mas não expõe filtros na UI. |
| RF032 | Administrador editar agendamento | Implementado | `admin-agenda.component.ts`; `agendamento-edicao.component.ts`; `AgendamentoController.java` | Diálogo de edição e `PATCH /api/agendamentos/{id}`, restrito a ADMIN. |
| RF033 | Administrador excluir agendamento | Implementado | `frontend/src/app/features/agendamentos/admin/containers/agendamentos/agendamentos.component.ts`; `AgendamentoController.java` | Listagem chama remoção e backend oferece `DELETE`, restrito a ADMIN. |
| RF034 | Profissional visualizar somente seus agendamentos | Implementado | `AgendamentoService.java`; `AgendaService.java` | Para perfil PROFISSIONAL, ambos os serviços substituem o filtro pelo profissional vinculado ao usuário autenticado. |
| RF035 | Exibir apenas horários disponíveis na criação | Parcial | `AgendaService.java`; `agendamentos-servicos.component.ts`; `AgendamentoService.java` | UI usa `dias-disponiveis`/`disponibilidade` e marca slots ocupados. Contudo, o backend de criação apenas verifica conflito com outro agendamento; não valida se o horário informado está dentro da jornada de atendimento. |
| RF036 | Validar obrigatórios antes de criar agendamento | Parcial | `agendamento-form.component.ts`; `AgendamentoRequestDTO.java`; `AgendamentoServicoDTO.java` | UI exige cliente (quando ADMIN) e serviço; DTO exige status e lista não vazia. Falta `@Valid` na lista `servicos`, logo as anotações obrigatórias dos itens aninhados não são garantidas pelo backend. |

## Requisitos não funcionais

| ID | Requisito resumido | Situação | Evidência estática | Observações |
| --- | --- | --- | --- | --- |
| RNF01 | Somente autenticados podem ler/escrever no banco | Parcial | `backend/src/main/java/br/edu/ifba/flowmanager/config/SecurityConfig.java`; `JwtAuthenticationFilter.java` | A política padrão exige autenticação e as APIs de domínio são protegidas por perfil. Exceções públicas intencionais existem para login, refresh e cadastro; por isso o requisito literal de toda operação de leitura/escrita autenticada não é atendido integralmente. |
| RNF02 | Interface responsiva para celular, tablet e desktop | Implementado | `frontend/src/styles.scss`; SCSS dos componentes de agenda | Há breakpoints em 600, 768 e 1024 px, layout de tabela móvel e ajustes específicos das agendas. A compatibilidade visual real requer validação manual em dispositivos/navegadores. |

## Síntese

| Situação | Quantidade |
| --- | ---: |
| Implementado | 30 |
| Parcial | 7 |
| Não implementado | 1 |
| Total | 38 |

## Pendências prioritárias identificadas

1. Liberar `GET /api/clientes/me` para CLIENTE (ou remover essa chamada no formulário e usar o cliente inferido no backend) para viabilizar RF022–RF024.
2. Criar fluxo de remarcação para CLIENTE, incluindo autorização de `PATCH` limitada ao próprio agendamento, para atender RF025.
3. No backend, validar que cada `dataHoraInicio` está dentro de um horário de atendimento do profissional e adicionar `@Valid` a `List<AgendamentoServicoDTO>`.
4. Definir e implementar os filtros esperados na agenda do profissional, caso RF031 exija filtros também para esse perfil.
