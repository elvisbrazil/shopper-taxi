import { Request, Response, NextFunction } from 'express';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { customer_id, origin, destination, driver } = req.body;

  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os campos customer_id, origin e destination são obrigatórios.',
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os endereços de origem e destino não podem ser o mesmo.',
    });
  }

  if (driver && (!driver.id || !driver.name)) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os campos id e name do driver são obrigatórios.',
    });
  }

  next();
};

export default validateRequest;