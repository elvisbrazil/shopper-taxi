CREATE DATABASE IF NOT EXISTS `sistema` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sistema`;

-- Tabela de motoristas (mantida igual)
CREATE TABLE IF NOT EXISTS `motoristas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT,
  `carro` VARCHAR(255),
  `avaliacao` VARCHAR(255),
  `taxa_km` DECIMAL(10, 2),
  `minimo` DECIMAL(10, 2),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `usuario_id` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(20),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário de teste na tabela de usuários
INSERT INTO `usuarios` (`nome`, `email`, `usuario_id`, `senha`, `telefone`) VALUES
('Usuário Teste', 'teste@exemplo.com', '1', 'senha123', '(11) 99999-9999');


-- Tabela de viagens 
CREATE TABLE IF NOT EXISTS `viagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `motorista_id` INT,
  `origin` VARCHAR(255) NOT NULL,
  `origin_latitude` DECIMAL(10, 8),
  `origin_longitude` DECIMAL(11, 8),
  `destination` VARCHAR(255) NOT NULL,
  `destination_latitude` DECIMAL(10, 8),
  `destination_longitude` DECIMAL(11, 8),
  `distancia_km` DECIMAL(10, 2),
  `duracao_estimada` VARCHAR(255),
  `valor` DECIMAL(10, 2),
  `status` ENUM('solicitada', 'aceita', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'solicitada',
  `data` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`motorista_id`) REFERENCES `motoristas`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Google Maps Results (atualizada com usuario_id)
CREATE TABLE IF NOT EXISTS `google_maps_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` VARCHAR(255) NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `response_api` TEXT,
  `distancia_km` DECIMAL(10,2),
  `duracao_estimada` VARCHAR(50),
  `status` ENUM('sucesso', 'erro') DEFAULT 'sucesso',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dados iniciais para motoristas
INSERT INTO `motoristas` (`nome`, `descricao`, `carro`, `avaliacao`, `taxa_km`, `minimo`) VALUES
('Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', '2/5', 2.50, 1),
('Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', '4/5', 5.00, 5),
('James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', '5/5', 10.00, 10);

