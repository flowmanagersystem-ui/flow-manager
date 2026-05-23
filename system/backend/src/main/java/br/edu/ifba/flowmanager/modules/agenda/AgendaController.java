package br.edu.ifba.flowmanager.modules.agenda;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    // disponibilidade de um profissional em um dia para um serviço
    @GetMapping("/disponibilidade")
    public DisponibilidadeDTO getDisponibilidade(
        @RequestParam Long profissionalId,
        @RequestParam String diaSemana,
        @RequestParam Long servicoId
    ) {
        return agendaService.getDisponibilidade(profissionalId, diaSemana, servicoId);
    }

    // todos os profissionais disponíveis para um serviço em um dia
    @GetMapping("/profissionais-disponiveis")
    public List<DisponibilidadeDTO> getProfissionaisDisponiveis(
        @RequestParam Long servicoId,
        @RequestParam String diaSemana
    ) {
        return agendaService.getProfissionaisDisponiveis(servicoId, diaSemana);
    }
}
