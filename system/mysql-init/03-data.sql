SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;

START TRANSACTION;

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Admin', 'Administrador', 'admin@email.com', 'ADMIN', 'root', 1, '(77) 9 8841-3654');

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Alice', 'Silva', 'alice@email.com', 'CLIENTE', 'senha123', 1, '(77) 9 9965-3177');

        SET @usuario_id = LAST_INSERT_ID();        
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Bob', 'Santos', 'bob@email.com', 'CLIENTE', 'senha456', 1, '(77) 9 98803-7942');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Ana', 'Silva', 'ana@email.com', 'CLIENTE', 'senha789', 1, '(77) 9 9952-3168');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Carlos', 'Melo', 'carlos@email.com', 'CLIENTE', 'senha012', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marina', 'Luz', 'marina@email.com', 'CLIENTE', 'senha345', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Pedro', 'Ramos', 'pedro@email.com', 'CLIENTE', 'senha678', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Luisa', 'Torres', 'luisa@email.com', 'CLIENTE', 'senha901', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Roberto', 'Lima', 'roberto@email.com', 'CLIENTE', 'senha234', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Fernanda', 'Costa', 'fernanda@email.com', 'CLIENTE', 'senha567', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Thiago', 'Borges', 'thiago@email.com', 'CLIENTE', 'senha890', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Claudia', 'Faria', 'claudia@email.com', 'CLIENTE', 'senha123', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Diego', 'Monteiro', 'diego@email.com', 'CLIENTE', 'senha456', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Patricia', 'Nunes', 'patricia@email.com', 'CLIENTE', 'senha789', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Lucas', 'Andrade', 'lucas@email.com', 'CLIENTE', 'senha012', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Juliana', 'Reis', 'juliana@email.com', 'CLIENTE', 'senha345', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Bruno', 'Carvalho', 'bruno@email.com', 'CLIENTE', 'senha678', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Natalia', 'Souza', 'natalia@email.com', 'CLIENTE', 'senha901', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Fabio', 'Gomes', 'fabio@email.com', 'CLIENTE', 'senha234', 1, '(77) 9 8841-3654');
        
        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Renata', 'Pinto', 'renata@email.com', 'CLIENTE', 'senha567', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marcelo', 'Dias', 'marcelo@email.com', 'CLIENTE', 'senha890', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Aline', 'Castro', 'aline@email.com', 'CLIENTE', 'senha123', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Rodrigo', 'Ferreira', 'rodrigo@email.com', 'CLIENTE', 'senha456', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Camila', 'Santos', 'camila@email.com', 'CLIENTE', 'senha789', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Eduardo', 'Lima', 'eduardo@email.com', 'CLIENTE', 'senha012', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Beatriz', 'Oliveira', 'beatriz@email.com', 'CLIENTE', 'senha345', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Gabriel', 'Costa', 'gabriel@email.com', 'CLIENTE', 'senha678', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Leticia', 'Martins', 'leticia@email.com', 'CLIENTE', 'senha901', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Vitor', 'Pereira', 'vitor@email.com', 'CLIENTE', 'senha234', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Sabrina', 'Cunha', 'sabrina@email.com', 'CLIENTE', 'senha567', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Felipe', 'Ribeiro', 'felipe@email.com', 'CLIENTE', 'senha890', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Debora', 'Alves', 'debora@email.com', 'CLIENTE', 'senha123', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Dayana', 'Alves', 'dayana@salao.com', 'PROFISSIONAL', 'senha901', 1, '(47) 9 9001-0001');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Jo', 'Souza', 'joao@salao.com', 'PROFISSIONAL', 'senha902', 1, '(47) 9 9002-0002');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Sofia', 'Oliveira', 'sofia@salao.com', 'PROFISSIONAL', 'senha903', 1, '(47) 9 9003-0003');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Carla', 'Mendes', 'carla@salao.com', 'PROFISSIONAL', 'senha904', 1, '(47) 9 9004-0004');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Natalia', 'Costa', 'natalia@salao.com', 'PROFISSIONAL', 'senha905', 1, '(47) 9 9005-0005');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Roberta', 'Lima', 'roberta@salao.com', 'PROFISSIONAL', 'senha906', 1, '(47) 9 9006-0006');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marcela', 'Freitas', 'marcela@salao.com', 'PROFISSIONAL', 'senha907', 1, '(47) 9 9007-0007');
        
        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Paulo', 'Ribeiro', 'paulo@salao.com', 'PROFISSIONAL', 'senha908', 1, '(47) 9 9008-0008');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

COMMIT;

INSERT INTO servico (nome, descricao, categoria, valor, duracao)
VALUES ('Corte Feminino', 'Corte tradicional feminino com técnica em tesoura', 'Cabelo', 80.00, 60),
        ('Corte Masculino', 'Corte masculino clássico com acabamento na máquina', 'Cabelo', 50.00, 30),
        ('Barba Completa', 'Barba desenhada, aparada e hidratada', 'Rosto', 45.00, 30),
        ('Manicure', 'Cuidado e esmaltação das unhas das mãos', 'Mãos', 35.00, 45),
        ('Pedicure', 'Cuidado e esmaltação das unhas dos pés com esfoliação', 'Pés', 40.00, 45),
        ('Tingimento', 'Coloração completa com produtos de qualidade', 'Cabelo', 200.00, 120),
        ('Mechas Completas', 'Técnica de mechas para iluminar ou escurecer fios', 'Cabelo', 250.00, 150),
        ('Escova Progressiva', 'Alisamento progressivo de longa duração', 'Cabelo', 300.00, 180),
        ('Hidratação Capilar', 'Tratamento intensivo para cabelos ressecados', 'Cabelo', 90.00, 60),
        ('Massagem Relaxante', 'Massagem corporal com óleos essenciais aromaterapia', 'Corpo', 150.00, 90),
        ('Massagem Modeladora', 'Técnica drenante para modelar e tonificar o corpo', 'Corpo', 130.00, 60),
        ('Maquiagem Social', 'Maquiagem para eventos e festas', 'Rosto', 120.00, 60),
        ('Maquiagem Noiva', 'Maquiagem especial com alta durabilidade', 'Rosto', 350.00, 90),
        ('Depilação Pernas', 'Depilação completa das pernas com cera', 'Pés', 70.00, 60),
        ('Limpeza de Pele', 'Limpeza facial profunda com extração', 'Rosto', 110.00, 75),
        ('Design de Sobrancelhas', 'Modelagem com fio ou pinça profissional', 'Rosto', 30.00, 20),
        ('Escova Simples', 'Escova modeladora para volume e brilho', 'Cabelo', 60.00, 45),
        ('Corte Infantil', 'Corte para crianças até 12 anos', 'Cabelo', 35.00, 20),
        ('Alongamento de Unhas', 'Unhas em gel ou acrílico com design personalizado', 'Mãos', 150.00, 90),
        ('Reflexo', 'Técnica para adicionar brilho e luminosidade', 'Cabelo', 160.00, 90),
        ('Spa dos Pés', 'Tratamento completo com esfoliação e hidratação', 'Pés', 70.00, 60),
        ('Botox Capilar', 'Reconstrução capilar com efeito liso e sedoso', 'Cabelo', 220.00, 120),
        ('Penteado Festa', 'Penteado elaborado para eventos especiais', 'Rosto', 130.00, 75);