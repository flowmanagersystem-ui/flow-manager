package br.edu.ifba.flowmanager.modulos.cliente;

import br.edu.ifba.flowmanager.modules.cliente.Cliente;
import br.edu.ifba.flowmanager.modules.cliente.ClienteRepository;
import br.edu.ifba.flowmanager.modules.usuario.Usuario;
import br.edu.ifba.flowmanager.modules.usuario.UsuarioRepository;
import br.edu.ifba.flowmanager.modules.usuario.enums.PerfilUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest  // ← sobe só JPA + H2, sem o contexto completo do Spring
class ClienteRepositoryTest {

    @Autowired ClienteRepository clienteRepository;
    @Autowired UsuarioRepository usuarioRepository;

    private Cliente cliente;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setNome("João");
        usuario.setSobrenome("Silva");
        usuario.setEmail("joao@email.com");
        usuario.setTelefone("(71) 9 9999-9999");
        usuario.setSenha("senha123");
        usuario.setAtivo(true);
        usuario.setPerfil(PerfilUsuario.CLIENTE);

        cliente = new Cliente();
        cliente.setUsuario(usuario);
        clienteRepository.save(cliente);
    }

    @Test
    @DisplayName("findAllWithUsuario deve retornar página com usuario carregado")
    void deveRetornarPaginaComUsuarioCarregado() {
        Page<Cliente> resultado = clienteRepository
            .findAllWithUsuario(PageRequest.of(0, 10));

        assertThat(resultado).isNotEmpty();
        assertThat(resultado.getContent().get(0).getUsuario()).isNotNull();
        assertThat(resultado.getContent().get(0).getUsuario().getNome())
            .isEqualTo("João");
    }

    @Test
    @DisplayName("existsByEmail deve retornar true para email cadastrado")
    void deveRetornarTrueParaEmailExistente() {
        assertThat(usuarioRepository.existsByEmail("joao@email.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmail deve retornar false para email não cadastrado")
    void deveRetornarFalseParaEmailInexistente() {
        assertThat(usuarioRepository.existsByEmail("outro@email.com")).isFalse();
    }

    @Test
    @DisplayName("existsByEmailAndIdNot deve ignorar o próprio ID")
    void deveIgnorarProprioIdNaVerificacaoDeEmail() {
        Long usuarioId = cliente.getUsuario().getId();

        // mesmo email mas excluindo o próprio id → não é duplicado
        assertThat(usuarioRepository
            .existsByEmailAndIdNot("joao@email.com", usuarioId))
            .isFalse();

        // mesmo email com id de outro → é duplicado
        assertThat(usuarioRepository
            .existsByEmailAndIdNot("joao@email.com", 999L))
            .isTrue();
    }

    @Test
    @DisplayName("findById deve retornar vazio para id inexistente")
    void deveRetornarVazioParaIdInexistente() {
        assertThat(clienteRepository.findById(999L)).isEmpty();
    }
}