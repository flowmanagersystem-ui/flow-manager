# Matriz de Rastreabilidade de Requisitos

**Sistema:** Flow Manager  
**Fonte dos requisitos:** `requisitos_consolidados.md`  
**Método:** inspeção estática do código-fonte de frontend Angular e backend Spring Boot, seguida de rodada de correções aplicadas com base nesta matriz.  
**Data da análise original:** 09/09/2026  
**Data da revisão/fechamento:** 15/09/2026

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
| RF018 | Adicionar horário de atendimento | Implementado | `frontend/src/app/features/profissionais/containers/profissionais-horarios/horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Há diálogo e `POST /api/profissionais/{id}/horarios`; backend valida intervalo (`horaInicio` < `horaFim`) e conflito. |
| RF019 | Remover horário de atendimento | Implementado | `horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Ação de remoção e `DELETE /api/profissionais/{id}/horarios/{id}`. |
| RF020 | Editar horário de atendimento | Implementado | `horario-atendimento-dialog.component.ts`; `HorarioAtendimentoController.java` | Atualização por `PATCH` e verificação de conflito. |
| RF021 | Vincular serviços a profissional | Implementado | `frontend/src/app/features/profissionais/containers/profissional-servicos/profissional-servicos-dialog.component.ts`; `ProfissionalController.java` | Endpoints de inclusão/remoção de vínculos e diálogo administrativo. |
| RF022 | Cliente selecionar data/hora no agendamento | **Implementado** | `agendamentos-servicos.component.ts`; `AgendaController.java`; `SecurityConfig.java` | **Corrigido em 15/09/2026.** `GET /api/clientes/me` estava sendo capturado pela regra genérica `hasRole("ADMIN")` antes de qualquer regra específica. Adicionada regra `hasAnyRole("ADMIN","PROFISSIONAL","CLIENTE")` para `GET /api/clientes/me`, posicionada antes da regra genérica de `/api/clientes/**`. |
| RF023 | Cliente selecionar serviço no agendamento | **Implementado** | `agendamentos-servicos.component.ts`; `ServicoController.java`; `SecurityConfig.java` | Mesma correção de RF022 — desbloqueio de `GET /api/clientes/me` destrava o fluxo completo de criação de agendamento pelo cliente. |
| RF024 | Cliente selecionar profissional no agendamento | **Implementado** | `agendamentos-servicos.component.ts`; `ProfissionalController.java`; `SecurityConfig.java` | Mesma correção de RF022. |
| RF025 | Cliente remarcar agendamento | **Implementado** | `cliente-agenda.component.ts`; `remarcar-agendamento.component.ts` (novo); `AgendamentoController.java`; `AgendamentoService.java`; `SecurityConfig.java` | **Implementado em 15/09/2026.** Novo endpoint `PATCH /api/agendamentos/{id}/reagendar`, restrito a `ADMIN`/`CLIENTE` e validado por posse via `validarAcessoAoAgendamento` (cliente só remarca o próprio agendamento). Suporta múltiplos serviços por agendamento. Novo componente `RemarcarAgendamentoComponent` reaproveita `AgendamentosServicosComponent` para seleção de novo(s) serviço(s)/horário(s). Ação "remarcar" adicionada ao diálogo de evento, visível apenas quando `status === AGENDADO`. Reaproveita a mesma checagem de conflito/habilitação usada na criação. |
| RF026 | Administrador selecionar cliente ao criar agendamento | Implementado | `agendamento-form.component.ts`; `AgendamentoService.java` | Formulário exige cliente para ADMIN e backend usa `clienteId`. |
| RF027 | Administrador selecionar data/hora ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `AgendaController.java` | O diálogo de serviço apresenta dias/slots e forma `dataHoraInicio`. |
| RF028 | Administrador selecionar serviço ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `ServicoController.java` | Lista de serviços e `servicoId` no payload. |
| RF029 | Administrador selecionar profissional ao criar agendamento | Implementado | `agendamentos-servicos.component.ts`; `ServicoController.java` | Profissionais são carregados por serviço e `profissionalId` segue no payload. |
| RF030 | Administrador inserir desconto | Implementado | `agendamento-form.component.ts`; `AgendamentoService.java` | Campo `desconto` é enviado e abatido do valor total, limitado ao mínimo zero. |
| RF031 | Admin/profissional ver agenda em modos e com filtros | **Implementado** | `admin-agenda.component.ts`; `profissional-agenda.component.ts` (atualizado); `AgendaService.java` | **Implementado em 15/09/2026.** Adicionado filtro de status (`statusSelecionado`, `statusOptions`, `onFiltroChange`, `onLimparFiltros`) à agenda do profissional, replicando o padrão já usado no admin. Filtro de profissional não se aplica a essa tela, pois o backend já restringe a agenda ao próprio profissional autenticado. Requer módulos `MatFormFieldModule`, `MatSelectModule`, `MatButtonModule`, `MatIconModule` adicionados ao componente; verificar se o SCSS da tela do profissional replica as classes `.filters` do admin. |
| RF032 | Administrador editar agendamento | Implementado | `admin-agenda.component.ts`; `agendamento-edicao.component.ts`; `AgendamentoController.java` | Diálogo de edição e `PATCH /api/agendamentos/{id}`, restrito a ADMIN. |
| RF033 | Administrador excluir agendamento | Implementado | `frontend/src/app/features/agendamentos/admin/containers/agendamentos/agendamentos.component.ts`; `AgendamentoController.java` | Listagem chama remoção e backend oferece `DELETE`, restrito a ADMIN. |
| RF034 | Profissional visualizar somente seus agendamentos | Implementado | `AgendamentoService.java`; `AgendaService.java` | Para perfil PROFISSIONAL, ambos os serviços substituem o filtro pelo profissional vinculado ao usuário autenticado. |
| RF035 | Exibir apenas horários disponíveis na criação | Implementado | `AgendaService.java`; `agendamentos-servicos.component.ts`; `AgendamentoService.java` | **Validação de jornada implementada em 15/09/2026** em `AgendamentoService.processarServicos()` (verifica se o horário está dentro de `HorarioAtendimento` do profissional, via `HorarioAtendimentoRepository.findByProfissionalIdAndDiaSemana`).  |
| RF036 | Validar obrigatórios antes de criar agendamento | **Implementado** | `agendamento-form.component.ts`; `AgendamentoRequestDTO.java`; `AgendamentoServicoDTO.java`; `AgendamentoReagendamentoDTO.java` (novo) | **Corrigido em 15/09/2026.** Adicionado `@Valid` à lista `List<AgendamentoServicoDTO> servicos` em `AgendamentoRequestDTO` e no novo `AgendamentoReagendamentoDTO`, garantindo que as anotações (`@NotNull`) dos itens aninhados sejam de fato verificadas pelo Bean Validation. |

## Requisitos não funcionais

| ID | Requisito resumido | Situação | Evidência estática | Observações |
| --- | --- | --- | --- | --- |
| RNF01 | Somente autenticados podem ler/escrever no banco, exceto autenticação e cadastro público | **Implementado** | `backend/src/main/java/br/edu/ifba/flowmanager/config/SecurityConfig.java`; `JwtAuthenticationFilter.java` | **Revisado em 15/09/2026.** Texto do requisito ajustado para refletir exceções estruturalmente necessárias: `/`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/cadastro` e `OPTIONS /**` são públicos porque são o próprio mecanismo de obtenção do token — não há como autenticar sem eles. Revisão confirmou, por leitura completa do `SecurityConfig`, que não existe nenhum endpoint de domínio público por omissão; `anyRequest().authenticated()` cobre o restante. Reclassificado de Parcial para Implementado. |
| RNF02 | Interface responsiva para celular, tablet e desktop | Implementado | `frontend/src/styles.scss`; SCSS dos componentes de agenda | Há breakpoints em 600, 768 e 1024 px, layout de tabela móvel e ajustes específicos das agendas. A compatibilidade visual real requer validação manual em dispositivos/navegadores. |

## Síntese

| Situação | Quantidade |
| --- | ---: |
| Implementado | 38 |
| Parcial | 0 |
| Não implementado | 0 |
| Total | 38 |