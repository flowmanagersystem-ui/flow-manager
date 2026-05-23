package br.edu.ifba.flowmanager.modules.agenda;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.SlotDTO;
import br.edu.ifba.flowmanager.modules.agendamento.AgendamentoRepository;
import br.edu.ifba.flowmanager.modules.profissional.Profissional;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalRepository;
import br.edu.ifba.flowmanager.modules.profissional.ProfissionalServicoRepository;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.DiaSemana;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimento;
import br.edu.ifba.flowmanager.modules.profissional.horarioAtendimento.HorarioAtendimentoRepository;
import br.edu.ifba.flowmanager.modules.servico.Servico;
import br.edu.ifba.flowmanager.modules.servico.ServicoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final HorarioAtendimentoRepository horarioRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ProfissionalServicoRepository profissionalServicoRepository;
    private final ServicoRepository servicoRepository;

    public DisponibilidadeDTO getDisponibilidade(
        Long profissionalId,
        String diaSemana,
        Long servicoId
    ) {
        Profissional profissional = profissionalRepository.findById(profissionalId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Profissional não encontrado."));

        Servico servico = servicoRepository.findById(servicoId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Serviço não encontrado."));

        // horários do profissional naquele dia
        List<HorarioAtendimento> horariosDia = horarioRepository
            .findByProfissionalIdAndDiaSemana(profissionalId, DiaSemana.valueOf(diaSemana));

        if (horariosDia.isEmpty()) {
            return new DisponibilidadeDTO(
                profissionalId,
                profissional.getUsuario().getNome(),
                diaSemana,
                List.of()
            );
        }

        // agendamentos já existentes naquele dia da semana
        List<LocalTime> horariosOcupados = agendamentoRepository
            .findHorariosOcupadosByProfissionalAndDia(profissionalId, DiaSemana.valueOf(diaSemana));

        // gera slots baseado na duração do serviço
        List<SlotDTO> slots = gerarSlots(horariosDia, servico.getDuracao(), horariosOcupados);

        return new DisponibilidadeDTO(
            profissionalId,
            profissional.getUsuario().getNome(),
            diaSemana,
            slots
        );
    }

    public List<DisponibilidadeDTO> getProfissionaisDisponiveis(
        Long servicoId,
        String diaSemana
    ) {
        servicoRepository.findById(servicoId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Serviço não encontrado."));

        return profissionalServicoRepository.findByServicoId(servicoId)
            .stream()
            .map(profissionalServico -> getDisponibilidade(
                profissionalServico.getProfissional().getId(),
                diaSemana,
                servicoId
            ))
            .filter(disponibilidade -> disponibilidade.slots()
                .stream()
                .anyMatch(SlotDTO::disponivel))
            .toList();
    }

    private List<SlotDTO> gerarSlots(
        List<HorarioAtendimento> horarios,
        int duracaoMinutos,
        List<LocalTime> ocupados
    ) {
        List<SlotDTO> slots = new ArrayList<>();

        for (HorarioAtendimento h : horarios) {
            LocalTime atual = h.getHoraInicio();
            LocalTime fim = h.getHoraFim();

            while (!atual.plusMinutes(duracaoMinutos).isAfter(fim)) {
                boolean disponivel = !ocupados.contains(atual);
                slots.add(new SlotDTO(atual, disponivel, null));
                atual = atual.plusMinutes(duracaoMinutos);
            }
        }

        return slots;
    }
}
