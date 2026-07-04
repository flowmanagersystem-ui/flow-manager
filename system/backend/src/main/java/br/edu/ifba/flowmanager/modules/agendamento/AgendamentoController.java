package br.edu.ifba.flowmanager.modules.agendamento;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoRequestDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoResponseDTO;
import br.edu.ifba.flowmanager.modules.agendamento.dto.AgendamentoStatusRequestDTO;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @GetMapping
    public Page<AgendamentoResponseDTO> listAll(
        @RequestParam(required = false) Long clienteId,
        @RequestParam(required = false) StatusAgendamento status,
        @RequestParam(required = false) LocalDateTime dataInicio,
        @RequestParam(required = false) LocalDateTime dataFim,
        @PageableDefault(size = 10, sort = "dataHora") Pageable pageable,
        org.springframework.security.core.Authentication authentication
    ) {
        return agendamentoService.listAll(
            clienteId,
            status,
            dataInicio,
            dataFim,
            (Usuario) authentication.getPrincipal(),
            pageable
        );
    }

    @GetMapping("/{id}")
    public AgendamentoResponseDTO findById(
        @PathVariable Long id,
        org.springframework.security.core.Authentication authentication
    ) {
        return agendamentoService.findById(id, (Usuario) authentication.getPrincipal());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgendamentoResponseDTO create(
        @RequestBody @Valid AgendamentoRequestDTO dto,
        org.springframework.security.core.Authentication authentication
    ) {
        return agendamentoService.create(dto, (Usuario) authentication.getPrincipal());
    }

    @PatchMapping("/{id}")
    public AgendamentoResponseDTO update(
        @PathVariable Long id,
        @RequestBody @Valid AgendamentoRequestDTO dto
    ) {
        return agendamentoService.update(id, dto);
    }

    @PatchMapping("/{id}/status")
    public AgendamentoResponseDTO updateStatus(
        @PathVariable Long id,
        @RequestBody @Valid AgendamentoStatusRequestDTO dto,
        org.springframework.security.core.Authentication authentication
    ) {
        return agendamentoService.updateStatus(id, dto, (Usuario) authentication.getPrincipal());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        agendamentoService.delete(id);
    }
}
