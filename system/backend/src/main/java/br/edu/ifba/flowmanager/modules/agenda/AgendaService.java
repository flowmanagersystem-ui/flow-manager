package br.edu.ifba.flowmanager.modules.agenda;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.agenda.dto.DiasDisponiveisDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.SlotDTO;
import br.edu.ifba.flowmanager.modules.agendamento.AgendamentoRepository;
import br.edu.ifba.flowmanager.modules.agendamento.AgendamentoServico;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.DiaSemana;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimento;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimentoRepository;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import br.edu.ifba.flowmanager.modules.servico.ServicoRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
class AgendaService {
 
    private final HorarioAtendimentoRepository horarioRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ServicoRepository servicoRepository;
 
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
 
    // ── utilitários ───────────────────────────────────────────
 
    private List<SlotDTO> gerarSlots(
        LocalDate data,
        List<HorarioAtendimento> horarios,
        int duracaoMinutos,
        Long profissionalId
    ) {
        // busca serviços já agendados naquele dia
        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(23, 59, 59);
 
        List<AgendamentoServico> ocupados = agendamentoRepository
            .findServicosNoDia(profissionalId, inicioDia, fimDia);
 
        List<SlotDTO> slots = new ArrayList<>();
 
        for (HorarioAtendimento h : horarios) {
            LocalTime atual = h.getHoraInicio();
            LocalTime fim = h.getHoraFim();
 
            while (!atual.plusMinutes(duracaoMinutos).isAfter(fim)) {
                LocalDateTime slotInicio = data.atTime(atual);
                LocalDateTime slotFim = slotInicio.plusMinutes(duracaoMinutos);
 
                // verifica sobreposição com agendamentos existentes
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
}