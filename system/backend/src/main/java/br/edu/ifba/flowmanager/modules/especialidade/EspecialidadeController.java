package br.edu.ifba.flowmanager.modules.especialidade;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
public class EspecialidadeController {

    private final EspecialidadeRepository especialidadeRepository;

    @GetMapping
    public Page<Especialidade> listAll(@PageableDefault(size = 10) Pageable pageable) {
        return especialidadeRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Especialidade findById(@PathVariable Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Especialidade não encontrada."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Especialidade create(@RequestBody Especialidade especialidade) {
        if (especialidadeRepository.existsByNome(especialidade.getNome())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Especialidade já existe.");
        }
        return especialidadeRepository.save(especialidade);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!especialidadeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Especialidade não encontrada.");
        }
        especialidadeRepository.deleteById(id);
    }
}
