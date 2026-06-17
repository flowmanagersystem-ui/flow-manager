SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;

START TRANSACTION;

-- Senha: root
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Admin', 'Administrador', 'admin@email.com', 'ADMIN', '$2b$10$Viw0IuyyYvC689qSJ/pqI.RpiKYhc0wHGPKrMjypFupcxTEiPR3yW', 1, '(77) 9 8841-3654');

-- Senha: senha123
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Alice', 'Silva', 'alice@email.com', 'CLIENTE', '$2b$10$PcHgxwx5kK7K4Y/6vax16ey3OlZIPUBTLd//JQMOMTXVTpVMgcg2m', 1, '(77) 9 9965-3177');

        SET @usuario_id = LAST_INSERT_ID();        
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha456
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Bob', 'Santos', 'bob@email.com', 'CLIENTE', '$2b$10$dEbvRW4rraCCMr7g1jsIMe4XEE7cI/TvfZ9R/Fx67nrGTn5km.6uK', 1, '(77) 9 98803-7942');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha789
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Ana', 'Silva', 'ana@email.com', 'CLIENTE', '$2b$10$E2XK/basvemngut8gNHnReDaSN8HHHPA0RnYMBer6OUy.Gw3LPtqO', 1, '(77) 9 9952-3168');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha012
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Carlos', 'Melo', 'carlos@email.com', 'CLIENTE', 'b.BlgXlFZ0ye.Yt4hau2jBaDXRqCZ.37t7SNcW6Is2gTJpGda6', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha345
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marina', 'Luz', 'marina@email.com', 'CLIENTE', 'bMwl5Vo8kKZxt/Iu9y9dT.tZjgc.d8mYN2IwvxE.s3717tTQBNazW', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha678
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Pedro', 'Ramos', 'pedro@email.com', 'CLIENTE', 'b.mbc59QVcZldHutrG/y8z6A7hGsUdkIy', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha901      
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Luisa', 'Torres', 'luisa@email.com', 'CLIENTE', '$2b$10$Unf3wBOrNA1/xF/xw3zln.YCbh0wuNOnx4CmQRUJDGNwlWRaIyfE2', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha234
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Roberto', 'Lima', 'roberto@email.com', 'CLIENTE', '$2b$10$.26pviSW.uJb8W1R3A5dROvq5kbVhlRj3XG9Ipq6YAY/J33gCi3x6', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha567
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Fernanda', 'Costa', 'fernanda@email.com', 'CLIENTE', '$2b$10$3ihz3pE/BGoRkOP7NrLtx.Mu.vBHVet6io0c2NWkzLEFrUr6ogjQm', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha890
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Thiago', 'Borges', 'thiago@email.com', 'CLIENTE', '$2b$10$qg7ueP3m/wmjqzzarNTgeO9vADX3TXCZ/D6HXdX.NHfsnJELznCpO', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha123
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Claudia', 'Faria', 'claudia@email.com', 'CLIENTE', '$2b$10$PcHgxwx5kK7K4Y/6vax16ey3OlZIPUBTLd//JQMOMTXVTpVMgcg2m', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha456
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Diego', 'Monteiro', 'diego@email.com', 'CLIENTE', '$2b$10$dEbvRW4rraCCMr7g1jsIMe4XEE7cI/TvfZ9R/Fx67nrGTn5km.6uK', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha789
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Patricia', 'Nunes', 'patricia@email.com', 'CLIENTE', '$2b$10$E2XK/basvemngut8gNHnReDaSN8HHHPA0RnYMBer6OUy.Gw3LPtqO', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha012
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Lucas', 'Andrade', 'lucas@email.com', 'CLIENTE', 'b.BlgXlFZ0ye.Yt4hau2jBaDXRqCZ.37t7SNcW6Is2gTJpGda6', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha345
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Juliana', 'Reis', 'juliana@email.com', 'CLIENTE', 'bMwl5Vo8kKZxt/Iu9y9dT.tZjgc.d8mYN2IwvxE.s3717tTQBNazW', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha678
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Bruno', 'Carvalho', 'bruno@email.com', 'CLIENTE', 'b.mbc59QVcZldHutrG/y8z6A7hGsUdkIy', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha901
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Natalia', 'Souza', 'natalia@email.com', 'CLIENTE', '$2b$10$Unf3wBOrNA1/xF/xw3zln.YCbh0wuNOnx4CmQRUJDGNwlWRaIyfE2', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha234
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Fabio', 'Gomes', 'fabio@email.com', 'CLIENTE', '$2b$10$.26pviSW.uJb8W1R3A5dROvq5kbVhlRj3XG9Ipq6YAY/J33gCi3x6', 1, '(77) 9 8841-3654');
        
        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha567
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Renata', 'Pinto', 'renata@email.com', 'CLIENTE', '$2b$10$3ihz3pE/BGoRkOP7NrLtx.Mu.vBHVet6io0c2NWkzLEFrUr6ogjQm', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha890
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marcelo', 'Dias', 'marcelo@email.com', 'CLIENTE', '$2b$10$qg7ueP3m/wmjqzzarNTgeO9vADX3TXCZ/D6HXdX.NHfsnJELznCpO', 0, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha123
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Aline', 'Castro', 'aline@email.com', 'CLIENTE', '$2b$10$PcHgxwx5kK7K4Y/6vax16ey3OlZIPUBTLd//JQMOMTXVTpVMgcg2m', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha456
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Rodrigo', 'Ferreira', 'rodrigo@email.com', 'CLIENTE', '$2b$10$dEbvRW4rraCCMr7g1jsIMe4XEE7cI/TvfZ9R/Fx67nrGTn5km.6uK', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha789
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Camila', 'Santos', 'camila@email.com', 'CLIENTE', '$2b$10$E2XK/basvemngut8gNHnReDaSN8HHHPA0RnYMBer6OUy.Gw3LPtqO', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha012
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Eduardo', 'Lima', 'eduardo@email.com', 'CLIENTE', 'b.BlgXlFZ0ye.Yt4hau2jBaDXRqCZ.37t7SNcW6Is2gTJpGda6', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha345
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Beatriz', 'Oliveira', 'beatriz@email.com', 'CLIENTE', 'bMwl5Vo8kKZxt/Iu9y9dT.tZjgc.d8mYN2IwvxE.s3717tTQBNazW', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha678      
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Gabriel', 'Costa', 'gabriel@email.com', 'CLIENTE', 'b.mbc59QVcZldHutrG/y8z6A7hGsUdkIy', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha901
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Leticia', 'Martins', 'leticia@email.com', 'CLIENTE', '$2b$10$Unf3wBOrNA1/xF/xw3zln.YCbh0wuNOnx4CmQRUJDGNwlWRaIyfE2', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha234
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Vitor', 'Pereira', 'vitor@email.com', 'CLIENTE', '$2b$10$.26pviSW.uJb8W1R3A5dROvq5kbVhlRj3XG9Ipq6YAY/J33gCi3x6', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha567
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Sabrina', 'Cunha', 'sabrina@email.com', 'CLIENTE', '$2b$10$3ihz3pE/BGoRkOP7NrLtx.Mu.vBHVet6io0c2NWkzLEFrUr6ogjQm', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha890
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Felipe', 'Ribeiro', 'felipe@email.com', 'CLIENTE', '$2b$10$qg7ueP3m/wmjqzzarNTgeO9vADX3TXCZ/D6HXdX.NHfsnJELznCpO', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha123      
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Debora', 'Alves', 'debora@email.com', 'CLIENTE', '$2b$10$PcHgxwx5kK7K4Y/6vax16ey3OlZIPUBTLd//JQMOMTXVTpVMgcg2m', 1, '(77) 9 8841-3654');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO cliente (usuario_id) VALUES (@usuario_id);

-- Senha: senha456
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Dayana', 'Alves', 'dayana@salao.com', 'PROFISSIONAL', '$2b$10$Unf3wBOrNA1/xF/xw3zln.YCbh0wuNOnx4CmQRUJDGNwlWRaIyfE2', 1, '(47) 9 9001-0001');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha789
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Jo', 'Souza', 'joao@salao.com', 'PROFISSIONAL', 'b', 1, '(47) 9 9002-0002');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha012
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Sofia', 'Oliveira', 'sofia@salao.com', 'PROFISSIONAL', 'b.sk53eW1K26oxW02zPq4i5ntu', 1, '(47) 9 9003-0003');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha345
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Carla', 'Mendes', 'carla@salao.com', 'PROFISSIONAL', 'bN9q0dVWelgyU.2F4tW7nOcoVlp0xlHYSaTDLmaG9sbKORJbXwNCG', 1, '(47) 9 9004-0004');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha678
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Natalia', 'Costa', 'natalia@salao.com', 'PROFISSIONAL', 'b.FBvcBdb1eD7JXvYvPVou..8ZTxGov2x.Ge4y/bGrthKUY4cXVz2', 1, '(47) 9 9005-0005');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha901
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Roberta', 'Lima', 'roberta@salao.com', 'PROFISSIONAL', 'bzZtn6Cff1d5kcbbFNiEmunyCRXe71WQQXf5.PLpehY3ohnVNy1Iq', 1, '(47) 9 9006-0006');

        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha234
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Marcela', 'Freitas', 'marcela@salao.com', 'PROFISSIONAL', '$2b$10$AaJ3tSOPWULOVgqYEsb/P.njmp9V9gcrXsYFrBDJ2K9XBVqxJxH3a', 1, '(47) 9 9007-0007');
        
        SET @usuario_id = LAST_INSERT_ID();
        INSERT INTO profissional (usuario_id) VALUES (@usuario_id);

-- Senha: senha567
INSERT INTO usuario (nome, sobrenome, email, perfil, senha, ativo, telefone) 
        VALUES ('Paulo', 'Ribeiro', 'paulo@salao.com', 'PROFISSIONAL', 'b', 1, '(47) 9 9008-0008');

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