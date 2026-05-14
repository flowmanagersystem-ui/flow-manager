package br.edu.ifba.flowmanager.modules.horarioAtendimento;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import br.edu.ifba.flowmanager.modules.horarioAtendimento.dto.HorarioAtendimentoRequestDTO;
import br.edu.ifba.flowmanager.modules.horarioAtendimento.dto.HorarioAtendimentoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profissionais/{profissionalId}/horarios")
@RequiredArgsConstructor
public class HorarioAtendimentoController {

    private final HorarioAtendimentoService horarioService;

    @GetMapping
    public List<HorarioAtendimentoResponseDTO> listar(@PathVariable Long profissionalId) {
        return horarioService.listarPorProfissional(profissionalId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HorarioAtendimentoResponseDTO create(
        @PathVariable Long profissionalId,
        @RequestBody @Valid HorarioAtendimentoRequestDTO dto
    ) {
        return horarioService.create(profissionalId, dto);
    }

    @PatchMapping("/{id}")
    public HorarioAtendimentoResponseDTO update(
        @PathVariable Long profissionalId,
        @PathVariable Long id,
        @RequestBody @Valid HorarioAtendimentoRequestDTO dto
    ) {
        return horarioService.update(profissionalId, id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long profissionalId, @PathVariable Long id) {
        horarioService.delete(id);
    }
}