package br.edu.ifba.flowmanager.modules.profissional;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalRequestDTO;
import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalResponseDTO;
import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalUpdateDTO;
import br.edu.ifba.flowmanager.modules.servico.dto.ServicoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    // @GetMapping
    // public Page<ProfissionalResponseDTO> listAll(
    //     @PageableDefault(size = 10, sort = "usuario.nome") Pageable pageable
    // ) {
    //     return profissionalService.listAll(pageable);
    // }

    @GetMapping
    public Page<ProfissionalResponseDTO> listAll(
        @RequestParam(required = false) String filtro,
        @PageableDefault(size = 10, sort = "usuario.nome") Pageable pageable
    ) {
        return profissionalService.listAll(filtro, pageable);
    }

    @GetMapping("/{id}")
    public ProfissionalResponseDTO findById(@PathVariable Long id) {
        return profissionalService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProfissionalResponseDTO create(@RequestBody @Valid ProfissionalRequestDTO dto) {
        return profissionalService.create(dto);
    }

    @PatchMapping("/{id}")
    public ProfissionalResponseDTO update(@PathVariable Long id, @RequestBody @Valid ProfissionalUpdateDTO dto) {
        return profissionalService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        profissionalService.delete(id);
    }

    @GetMapping("/verificar-email")
    public Map<String, Boolean> verificarEmail(
        @RequestParam String email,
        @RequestParam(required = false) Long excludeId
    ) {
        return Map.of("existe", profissionalService.emailExiste(email, excludeId));
    }

    // Serviços
    @PostMapping("/{profissionalId}/servicos/{servicoId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void adicionarServico(
        @PathVariable Long profissionalId,
        @PathVariable Long servicoId
    ) {
        profissionalService.adicionarServico(profissionalId, servicoId);
    }

    @DeleteMapping("/{profissionalId}/servicos/{servicoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerServico(
        @PathVariable Long profissionalId,
        @PathVariable Long servicoId
    ) {
        profissionalService.removerServico(profissionalId, servicoId);
    }

    @GetMapping("/{profissionalId}/servicos")
    public List<ServicoResponseDTO> listarServicos(@PathVariable Long profissionalId) {
        return profissionalService.listarServicos(profissionalId);
    }

    // Especialidades
    @PostMapping("/{profissionalId}/especialidades/{especialidadeId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void adicionarEspecialidade(@PathVariable Long profissionalId, @PathVariable Long especialidadeId) {
        profissionalService.adicionarEspecialidade(profissionalId, especialidadeId);
    }

    @DeleteMapping("/{profissionalId}/especialidades/{especialidadeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerEspecialidade(@PathVariable Long profissionalId, @PathVariable Long especialidadeId) {
        profissionalService.removerEspecialidade(profissionalId, especialidadeId);
    }
}
