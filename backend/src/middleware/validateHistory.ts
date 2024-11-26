import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';

const databaseService = new DatabaseService();

export const validateRideHistoryRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.params; // O customer_id vem da rota
  const driver_id = req.query.driver_id; // O driver_id vem da query

  // Verifica se o ID do usuário está presente
  if (!customer_id) {
    return res.status(400).json({
      error_code: "NO_RIDES_FOUND",
      error_description: "Nenhum registro encontrado",
    });
  }

  // Se um ID de motorista for fornecido, verifica se ele é válido
  if (driver_id !== undefined && driver_id.trim() !== '') {
    const driverExists = await databaseService.driverExists(driver_id as string);
    if (!driverExists) {
      return res.status(400).json({
        error_code: "INVALID_DRIVER",
        error_description: "Motorista invalido",
      });
    }
  } else if (driver_id === '') {
    // Se o driver_id estiver vazio, retornar um erro
    return res.status(400).json({
        error_code: "INVALID_DRIVER",
        error_description: "Motorista invalido",
    });
  }

  next(); // Chama o próximo middleware ou a rota
};