package br.edu.ifba.flowmanager.modules.agenda;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.agenda.dto.AgendaEventoDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.AgendaEventoExtendedPropsDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DiasDisponiveisDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.SlotDTO;
import br.edu.ifba.flowmanager.modules.agendamento.Agendamento;
import br.edu.ifba.flowmanager.modules.agendamento.AgendamentoRepository;
import br.edu.ifba.flowmanager.modules.agendamento.AgendamentoServico;
import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoServicoResponseDTO;
import br.edu.ifba.flowmanager.modules.cliente.ClienteRepository;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.DiaSemana;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimento;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimentoRepository;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import br.edu.ifba.flowmanager.modules.servico.ServicoRepository;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
class AgendaService {
 
    private final HorarioAtendimentoRepository horarioRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ServicoRepository servicoRepository;
    private final ClienteRepository clienteRepository;
 
    // dias disponíveis no mês para o calendário
    DiasDisponiveisDTO getDiasDisponiveis(Long profissionalId, Long servicoId, int ano, int mes) {
        Profissional profissional = buscarProfissional(profissionalId);
        Servico servico = buscarServico(servicoId);
 
        YearMonth yearMonth = YearMonth.of(ano, mes);
        List<LocalDate> diasDisponiveis = new ArrayList<>();
 
        // para cada dia do mês verifica se tem slot disponível
        for (int dia = 1; dia <= yearMonth.lengthOfMonth(); dia++) {
            LocalDate data = LocalDate.of(ano, mes, dia);
 
            // ignora dias passados
            if (data.isBefore(LocalDate.now())) continue;
 
            DiaSemana diaSemana = converterDiaSemana(data);
            List<HorarioAtendimento> horarios = horarioRepository
                .findByProfissionalIdAndDiaSemana(profissionalId, diaSemana);
 
            if (horarios.isEmpty()) continue;
 
            // verifica se tem pelo menos 1 slot livre
            List<SlotDTO> slots = gerarSlots(data, horarios, servico.getDuracao(), profissionalId);
            boolean temSlotLivre = slots.stream().anyMatch(SlotDTO::disponivel);
 
            if (temSlotLivre) {
                diasDisponiveis.add(data);
            }
        }
 
        return new DiasDisponiveisDTO(
            profissionalId,
            profissional.getUsuario().getNome(),
            diasDisponiveis
        );
    }
 
    // slots disponíveis em uma data específica
    DisponibilidadeDTO getDisponibilidade(Long profissionalId, Long servicoId, LocalDate data) {
        Profissional profissional = buscarProfissional(profissionalId);
        Servico servico = buscarServico(servicoId);
 
        DiaSemana diaSemana = converterDiaSemana(data);
        List<HorarioAtendimento> horarios = horarioRepository
            .findByProfissionalIdAndDiaSemana(profissionalId, diaSemana);
 
        if (horarios.isEmpty()) {
            return new DisponibilidadeDTO(
                profissionalId,
                profissional.getUsuario().getNome(),
                data,
                List.of()
            );
        }
 
        List<SlotDTO> slots = gerarSlots(data, horarios, servico.getDuracao(), profissionalId);
 
        return new DisponibilidadeDTO(
            profissionalId,
            profissional.getUsuario().getNome(),
            data,
            slots
        );
    }

    List<AgendaEventoDTO> getEventos(
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        Long profissionalId,
        StatusAgendamento status,
        Usuario usuarioLogado
    ) {
        Long clienteId = null;

        if (usuarioLogado.getPerfil() == PerfilUsuario.CLIENTE) {
            clienteId = clienteRepository.findByUsuarioEmail(usuarioLogado.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Cliente não vinculado ao usuário logado."))
                .getId();
        }

        if (usuarioLogado.getPerfil() == PerfilUsuario.PROFISSIONAL) {
            profissionalId = profissionalRepository.findByUsuarioEmail(usuarioLogado.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Profissional não vinculado ao usuário logado."))
                .getId();
        }

        return agendamentoRepository
            .findEventosAgenda(clienteId, profissionalId, status, dataInicio, dataFim)
            .stream()
            .map(this::toEventoDTO)
            .toList();
    }
 
    // ── utilitários ───────────────────────────────────────────
 
    private List<SlotDTO> gerarSlots(
        LocalDate data,
        List<HorarioAtendimento> horarios,
        int duracaoMinutos,
        Long profissionalId
    ) {
        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(23, 59, 59);

        List<AgendamentoServico> ocupados = agendamentoRepository
            .findServicosNoDia(profissionalId, inicioDia, fimDia);

        List<SlotDTO> slots = new ArrayList<>();

        for (HorarioAtendimento h : horarios) {
            LocalTime inicio = h.getHoraInicio();
            LocalTime fim = h.getHoraFim();

            // horário cruzando a meia-noite (ou mal configurado) não é suportado por LocalTime puro;
            // ignorar em vez de entrar em loop infinito
            if (!fim.isAfter(inicio)) {
                continue;
            }

            LocalTime atual = inicio;

            while (!atual.plusMinutes(duracaoMinutos).isAfter(fim)) {
                LocalDateTime slotInicio = data.atTime(atual);
                LocalDateTime slotFim = slotInicio.plusMinutes(duracaoMinutos);

                boolean ocupado = ocupados.stream().anyMatch(o ->
                    o.getDataHoraInicio().isBefore(slotFim) &&
                    o.getDataHoraFim().isAfter(slotInicio)
                );

                slots.add(new SlotDTO(atual, !ocupado));
                atual = atual.plusMinutes(duracaoMinutos);
            }
        }

        return slots;
    }
 
    // converte DayOfWeek do Java para o enum DiaSemana do projeto
    private DiaSemana converterDiaSemana(LocalDate data) {
        return switch (data.getDayOfWeek()) {
            case MONDAY    -> DiaSemana.SEG;
            case TUESDAY   -> DiaSemana.TER;
            case WEDNESDAY -> DiaSemana.QUA;
            case THURSDAY  -> DiaSemana.QUI;
            case FRIDAY    -> DiaSemana.SEX;
            case SATURDAY  -> DiaSemana.SAB;
            case SUNDAY    -> DiaSemana.DOM;
        };
    }
 
    private Profissional buscarProfissional(Long id) {
        return profissionalRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Profissional não encontrado."));
    }
 
    private Servico buscarServico(Long id) {
        return servicoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Serviço não encontrado."));
    }

    private AgendaEventoDTO toEventoDTO(Agendamento agendamento) {
        List<AgendamentoServico> servicosOrdenados = agendamento.getServicos().stream()
            .sorted(Comparator.comparing(AgendamentoServico::getDataHoraInicio))
            .toList();

        LocalDateTime inicio = servicosOrdenados.stream()
            .map(AgendamentoServico::getDataHoraInicio)
            .min(LocalDateTime::compareTo)
            .orElse(agendamento.getDataHora());

        LocalDateTime fim = servicosOrdenados.stream()
            .map(AgendamentoServico::getDataHoraFim)
            .max(LocalDateTime::compareTo)
            .orElse(inicio.plusMinutes(30));

        List<AgendamentoServicoResponseDTO> servicos = servicosOrdenados.stream()
            .map(s -> new AgendamentoServicoResponseDTO(
                s.getProfissional().getId(),
                s.getProfissional().getUsuario().getNome(),
                s.getServico().getId(),
                s.getServico().getNome(),
                s.getServico().getValor(),
                s.getServico().getDuracao(),
                s.getDataHoraInicio(),
                s.getDataHoraFim()
            ))
            .toList();

        String title = "%s - %s".formatted(
            agendamento.getCliente().getUsuario().getNome(),
            servicos.isEmpty() ? "Agendamento" : servicos.get(0).nomeServico()
        );

        return new AgendaEventoDTO(
            agendamento.getId().toString(),
            title,
            inicio,
            fim,
            corPorStatus(agendamento.getStatus()),
            new AgendaEventoExtendedPropsDTO(
                agendamento.getId(),
                agendamento.getCliente().getId(),
                agendamento.getCliente().getUsuario().getNome(),
                inicio,
                fim,
                agendamento.getStatus(),
                agendamento.getObservacao(),
                agendamento.getDesconto(),
                agendamento.getValorTotal(),
                servicos
            )
        );
    }

    private String corPorStatus(StatusAgendamento status) {
        return switch (status) {
            case AGENDADO -> "#4FBF9B";
            case REAGENDADO -> "#FF9800";
            case CONCLUIDO -> "#9E9E9E";
            case CANCELADO -> "#e53935";
        };
    }
}
