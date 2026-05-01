package br.edu.ifba.flowmanager.modulos.cliente;

import br.edu.ifba.flowmanager.modules.cliente.Cliente;
import br.edu.ifba.flowmanager.modules.cliente.ClienteRepository;
import br.edu.ifba.flowmanager.modules.cliente.ClienteService;

    // create — email já cadastrado lança exceção    
    // create — salva cliente e retorna DTO correto
    // update — email duplicado (de outro usuário) lança exceção
    // update — atualiza sem alterar senha se vier vazia
    // delete — id inexistente lança exceção
    // findById — id inexistente lança exceção
    // emailExiste — com e sem excludeId
    // toDTO — mapeamento correto Ativo/Inativo


import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteRequestDTO;
import br.edu.ifba.flowmanager.modules.cliente.dto.ClienteResponseDTO;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.UsuarioRepository;
import br.edu.ifba.flowmanager.modules.usuario.enums.StatusUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock ClienteRepository clienteRepository;
    @Mock UsuarioRepository usuarioRepository;
    @InjectMocks ClienteService clienteService;

    private Cliente cliente;
    private ClienteRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João");
        usuario.setSobrenome("Silva");
        usuario.setEmail("joao@email.com");
        usuario.setTelefone("(71) 9 9999-9999");
        usuario.setSenha("senha123");
        usuario.setAtivo(true);

        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setUsuario(usuario);

        requestDTO = new ClienteRequestDTO(
            null,
            "João",
            "Silva",
            "joao@email.com",
            "(71) 9 9999-9999",
            "senha123",
            StatusUsuario.Ativo
        );
    }

    // ── CREATE ────────────────────────────────────────────────

    @Test
    @DisplayName("Deve criar cliente com sucesso")
    void deveCriarClienteComSucesso() {
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(clienteRepository.save(any())).thenReturn(cliente);

        ClienteResponseDTO response = clienteService.create(requestDTO);

        assertThat(response).isNotNull();
        assertThat(response.nome()).isEqualTo("João");
        assertThat(response.email()).isEqualTo("joao@email.com");
        assertThat(response.status()).isEqualTo(StatusUsuario.Ativo);

        verify(clienteRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cliente com email duplicado")
    void deveLancarExcecaoEmailDuplicadoNoCadastro() {
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> clienteService.create(requestDTO))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Email já cadastrado");

        verify(clienteRepository, never()).save(any());
    }

    // ── UPDATE ────────────────────────────────────────────────

    @Test
    @DisplayName("Deve atualizar cliente com sucesso")
    void deveAtualizarClienteComSucesso() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.existsByEmailAndIdNot(anyString(), anyLong())).thenReturn(false);
        when(clienteRepository.save(any())).thenReturn(cliente);

        ClienteResponseDTO response = clienteService.update(1L, requestDTO);

        assertThat(response).isNotNull();
        verify(clienteRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar com email de outro cliente")
    void deveLancarExcecaoEmailDuplicadoNoUpdate() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.existsByEmailAndIdNot(anyString(), anyLong())).thenReturn(true);

        assertThatThrownBy(() -> clienteService.update(1L, requestDTO))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Email já cadastrado");
    }

    @Test
    @DisplayName("Não deve alterar senha se vier vazia no update")
    void naoDeveAlterarSenhaSeVierVazia() {
        ClienteRequestDTO dtoSemSenha = new ClienteRequestDTO(
            1L, "João", "Silva", "joao@email.com",
            "(71) 9 9999-9999", "", StatusUsuario.Ativo
        );

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.existsByEmailAndIdNot(anyString(), anyLong())).thenReturn(false);
        when(clienteRepository.save(any())).thenReturn(cliente);

        String senhaAntes = cliente.getUsuario().getSenha();
        clienteService.update(1L, dtoSemSenha);

        assertThat(cliente.getUsuario().getSenha()).isEqualTo(senhaAntes);
    }

    // ── DELETE ────────────────────────────────────────────────

    @Test
    @DisplayName("Deve deletar cliente com sucesso")
    void deveDeletarClienteComSucesso() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        assertThatCode(() -> clienteService.delete(1L))
            .doesNotThrowAnyException();

        verify(clienteRepository, times(1)).delete(cliente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar cliente inexistente")
    void deveLancarExcecaoAoDeletarClienteInexistente() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clienteService.delete(99L))
            .isInstanceOf(ResponseStatusException.class);
    }

    // ── FIND BY ID ────────────────────────────────────────────

    @Test
    @DisplayName("Deve lançar exceção ao buscar cliente inexistente")
    void deveLancarExcecaoAoBuscarClienteInexistente() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clienteService.findById(99L))
            .isInstanceOf(ResponseStatusException.class);
    }

    // ── EMAIL ─────────────────────────────────────────────────

    @Test
    @DisplayName("Deve retornar true se email existir sem excludeId")
    void deveRetornarTrueSeEmailExistir() {
        when(usuarioRepository.existsByEmail("joao@email.com")).thenReturn(true);

        assertThat(clienteService.emailExiste("joao@email.com", null)).isTrue();
    }

    @Test
    @DisplayName("Deve verificar email excluindo o próprio ID")
    void deveVerificarEmailExcluindoProprioId() {
        when(usuarioRepository.existsByEmailAndIdNot("joao@email.com", 1L)).thenReturn(false);

        assertThat(clienteService.emailExiste("joao@email.com", 1L)).isFalse();
    }
}