package br.edu.ifba.flowmanager.modules.cliente;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestDTO;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteResponseDTO;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestUpdateDTO;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.UsuarioRepository;
import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    // public Page<ClienteResponseDTO> listAll(Pageable pageable) {
    //     return clienteRepository.findAllWithUsuario(pageable)
    //             .map(this::toDTO);
    // }
    public Page<ClienteResponseDTO> listAll(
        String filtro,
        Pageable pageable
    ) {
        return clienteRepository
            .findAllWithFiltro(filtro, pageable)
            .map(this::toDTO);
    }

    public ClienteResponseDTO findById(Long id) {
        return toDTO(buscarOuLancar(id));
    }

    @Transactional
    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado.");
        }

        Usuario usuario = new Usuario();
        preencherUsuario(usuario, dto);
        usuario.setPerfil(PerfilUsuario.CLIENTE);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);

        return toDTO(clienteRepository.save(cliente));
    }

    @Transactional
    public ClienteResponseDTO update(Long id, ClienteRequestUpdateDTO dto) {
        Cliente cliente = buscarOuLancar(id);
        Usuario usuario = cliente.getUsuario();        

        if (usuarioRepository.existsByEmailAndIdNot(dto.email(), usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado.");
        }

        preencherUsuario(usuario, dto);

        return toDTO(clienteRepository.save(cliente));
    }

    @Transactional
    public void delete(Long id) {
        clienteRepository.delete(buscarOuLancar(id));
    }

    public boolean emailExiste(String email, Long excludeId) {
        if (excludeId != null) {
            Cliente cliente = buscarOuLancar(excludeId);
            Usuario usuario = cliente.getUsuario();

            return usuarioRepository.existsByEmailAndIdNot(email, usuario.getId());
        }
        return usuarioRepository.existsByEmail(email);
    }

    private Cliente buscarOuLancar(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
    }

    private void preencherUsuario(Usuario usuario, ClienteRequestDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setAtivo(dto.status() == StatusUsuario.Ativo);
        usuario.setSenha(dto.senha()); 
    }

    private void preencherUsuario(Usuario usuario, ClienteRequestUpdateDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setAtivo(dto.status() == StatusUsuario.Ativo);

        if (senhaValida(dto.senha())) {
            usuario.setSenha(dto.senha());
        }
    }

    private ClienteResponseDTO toDTO(Cliente cliente) {
        Usuario u = cliente.getUsuario();

        return new ClienteResponseDTO(
            cliente.getId(),
            u.getNome(),
            u.getSobrenome(),
            u.getEmail(),
            u.getTelefone(),
            u.isAtivo() ? StatusUsuario.Ativo : StatusUsuario.Inativo
        );
    }

    private boolean senhaValida(String senha) {
        return senha != null && !senha.isBlank() && senha.length() >= 6;
    }
}