package br.edu.ifba.flowmanager.modules.profissional;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.especialidade.Especialidade;
import br.edu.ifba.flowmanager.modules.especialidade.EspecialidadeRepository;
import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalRequestDTO;
import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalResponseDTO;
import br.edu.ifba.flowmanager.modules.profissional.dto.ProfissionalUpdateDTO;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.UsuarioRepository;
import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfissionalService {
    private final ProfissionalRepository profissionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final ProfissionalEspecialidadeRepository profissionalEspecialidadeRepository;

    public Page<ProfissionalResponseDTO> listAll(Pageable pageable) {
        return profissionalRepository.findAllWithUsuario(pageable)
                .map(this::toDTO);
    }

    public ProfissionalResponseDTO findById(Long id) {
        return toDTO(buscarOuLancar(id));
    }

    @Transactional
    public ProfissionalResponseDTO create(ProfissionalRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado.");
        }

        Usuario usuario = new Usuario();
        preencherUsuario(usuario, dto);
        usuario.setPerfil(PerfilUsuario.PROFISSIONAL);

        Profissional profissional = new Profissional();
        profissional.setUsuario(usuario);

        Profissional salvo = profissionalRepository.save(profissional);

        // ← processar especialidades após salvar
        if (dto.especialidades() != null) {
            for (Long especialidadeId : dto.especialidades()) {
                adicionarEspecialidade(salvo.getId(), especialidadeId);
            }
        }

        return toDTO(profissionalRepository.findById(salvo.getId()).orElseThrow());
    }

    @Transactional
    public ProfissionalResponseDTO update(Long id, ProfissionalUpdateDTO dto) {
        Profissional profissional = buscarOuLancar(id);
        Usuario usuario = profissional.getUsuario();

        if (usuarioRepository.existsByEmailAndIdNot(dto.email(), usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado.");
        }

        preencherUsuario(usuario, dto);

        return toDTO(profissionalRepository.save(profissional));
    }

    @Transactional
    public void delete(Long id) {
        profissionalRepository.delete(buscarOuLancar(id));
    }

    public boolean emailExiste(String email, Long excludeId) {
        if (excludeId != null) {
            return usuarioRepository.existsByEmailAndIdNot(email, excludeId);
        }
        return usuarioRepository.existsByEmail(email);
    }

    @Transactional
    public void adicionarEspecialidade(Long profissionalId, Long especialidadeId) {
    Profissional profissional = buscarOuLancar(profissionalId);
    Especialidade especialidade = especialidadeRepository.findById(especialidadeId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Especialidade não encontrada."));

    ProfissionalEspecialidadeId id = new ProfissionalEspecialidadeId(profissionalId, especialidadeId);

    if (profissionalEspecialidadeRepository.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Especialidade já associada.");
    }

    ProfissionalEspecialidade profEspec = new ProfissionalEspecialidade();
    profEspec.setId(id);
    profEspec.setProfissional(profissional);
    profEspec.setEspecialidade(especialidade);

    profissionalEspecialidadeRepository.save(profEspec);
}

    @Transactional
    public void removerEspecialidade(Long profissionalId, Long especialidadeId) {
        profissionalEspecialidadeRepository.deleteByProfissionalIdAndEspecialidadeId(profissionalId, especialidadeId);
    }

    private Profissional buscarOuLancar(Long id) {
        return profissionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profissional não encontrado."));
    }

    private void preencherUsuario(Usuario usuario, ProfissionalRequestDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setAtivo(dto.status() == StatusUsuario.Ativo);
        usuario.setSenha(dto.senha());
    }

    private void preencherUsuario(Usuario usuario, ProfissionalUpdateDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setAtivo(dto.status() == StatusUsuario.Ativo);
        // usuario.setSenha(dto.senha());

        if (senhaValida(dto.senha())) {
            usuario.setSenha(dto.senha());
        }
    }

    private ProfissionalResponseDTO toDTO(Profissional profissional) {
        Usuario u = profissional.getUsuario();

        // Extrai nomes das especialidades associadas (se houver)
        String[] nomesEspecialidades = profissional.getEspecialidades() == null ? new String[0]
            : profissional.getEspecialidades().stream()
                .map(pe -> pe.getEspecialidade().getNome())
                .toArray(String[]::new);

        return new ProfissionalResponseDTO(
            profissional.getId(),
            u.getNome(),
            u.getSobrenome(),
            u.getEmail(),
            u.getTelefone(),
            nomesEspecialidades,
            u.isAtivo() ? StatusUsuario.Ativo : StatusUsuario.Inativo);
        }

    private boolean senhaValida(String senha) {
        return senha != null && !senha.isBlank() && senha.length() >= 6;
    }

}
