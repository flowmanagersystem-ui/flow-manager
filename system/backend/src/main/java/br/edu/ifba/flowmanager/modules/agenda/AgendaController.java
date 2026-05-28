package br.edu.ifba.flowmanager.modules.agenda;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import br.edu.ifba.flowmanager.modules.agenda.dto.DiasDisponiveisDTO;
import br.edu.ifba.flowmanager.modules.agenda.dto.DisponibilidadeDTO;

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
