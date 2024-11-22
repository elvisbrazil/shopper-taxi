CREATE DATABASE IF NOT EXISTS `sistema` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sistema`;


-- Tabela de motoristas
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

-- Inserir dados iniciais na tabela de motoristas
INSERT INTO `motoristas` (`nome`, `descricao`, `carro`, `avaliacao`, `taxa_km`, `minimo`) VALUES
('Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', '2/5', 2.50, 1),
('Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', '4/5', 5.00, 5),
('James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', '5/5', 10.00, 10);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário de teste na tabela de usuários
INSERT INTO `usuarios` (`usuario_id`, `senha`) VALUES
('1', 'senha123');

-- Tabela de viagens
CREATE TABLE IF NOT EXISTS `viagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `distancia_km` DECIMAL(10, 2),
  `valor` DECIMAL(10, 2),
  `data` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de rotas
CREATE TABLE IF NOT EXISTS `rotas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `destination_id` INT NOT NULL,
  `latitude` DECIMAL(10, 8),
  `longitude` DECIMAL(11, 8),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`destination_id`) REFERENCES `viagens`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs do Google Maps
CREATE TABLE IF NOT EXISTS `google_maps_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `origin` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `response_api` TEXT,
  `car` VARCHAR(255),
  `id_driver` INT,
  `name_driver` VARCHAR(255),
  `name_client` VARCHAR(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


