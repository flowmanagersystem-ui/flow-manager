package br.edu.ifba.flowmanager.modules.agenda;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import br.edu.ifba.flowmanager.modules.agenda.dto.AgendaEventoDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DiasDisponiveisDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
import br.edu.ifba.flowmanager.modules.agendamento.StatusAgendamento;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    // dias disponíveis no mês — usado para pintar o calendário
    // retorna lista de datas com pelo menos 1 slot livre
    @GetMapping("/dias-disponiveis")
    public DiasDisponiveisDTO getDiasDisponiveis(
        @RequestParam Long profissionalId,
        @RequestParam Long servicoId,
        @RequestParam int ano,
        @RequestParam int mes
    ) {
        return agendaService.getDiasDisponiveis(profissionalId, servicoId, ano, mes);
    }

    // slots disponíveis em uma data específica
    // chamado ao clicar em um dia no calendário
    @GetMapping("/disponibilidade")
    public DisponibilidadeDTO getDisponibilidade(
        @RequestParam Long profissionalId,
        @RequestParam Long servicoId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data
    ) {
        return agendaService.getDisponibilidade(profissionalId, servicoId, data);
    }

    @GetMapping("/eventos")
    public List<AgendaEventoDTO> getEventos(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
        @RequestParam(required = false) Long profissionalId,
        @RequestParam(required = false) StatusAgendamento status,
        org.springframework.security.core.Authentication authentication
    ) {
        return agendaService.getEventos(
            dataInicio,
            dataFim,
            profissionalId,
            status,
            (Usuario) authentication.getPrincipal()
        );
    }
}
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;
// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/agenda")
// @RequiredArgsConstructor
// public class AgendaController {

//     private final AgendaService agendaService;

//     // disponibilidade de um profissional em um dia para um serviço
//     @GetMapping("/disponibilidade")
//     public DisponibilidadeDTO getDisponibilidade(
//         @RequestParam Long profissionalId,
//         @RequestParam String diaSemana,
//         @RequestParam Long servicoId
//     ) {
//         return agendaService.getDisponibilidade(profissionalId, diaSemana, servicoId);
//     }

//     // todos os profissionais disponíveis para um serviço em um dia
//     @GetMapping("/profissionais-disponiveis")
//     public List<DisponibilidadeDTO> getProfissionaisDisponiveis(
//         @RequestParam Long servicoId,
//         @RequestParam String diaSemana
//     ) {
//         return agendaService.getProfissionaisDisponiveis(servicoId, diaSemana);
//     }
// }
