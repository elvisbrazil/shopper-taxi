import { Request, Response, NextFunction } from 'express';

export const validateRideRequests = (req: Request, res: Response, next: NextFunction) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: " O id do usuário não pode estar em branco."
    });
  }

  if (origin.trim() === "" || destination.trim() === "") {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os endereços de origem e destino não podem estar em branco."
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os endereços de origem e destino não podem ser o mesmo endereço."
    });
  }

  next();
};