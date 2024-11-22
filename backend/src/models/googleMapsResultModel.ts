import pool from '../config/database';

const createGoogleMapsResult = async (origin: string, destination: string, response_api: string, car: string, id_driver: number, name_driver: string, name_client: string) => {
  // Adicionando logs para verificar os valores dos parâmetros
  console.log('createGoogleMapsResult - origin:', origin);
  console.log('createGoogleMapsResult - destination:', destination);
  console.log('createGoogleMapsResult - response_api:', response_api);
  console.log('createGoogleMapsResult - car:', car);
  console.log('createGoogleMapsResult - id_driver:', id_driver);
  console.log('createGoogleMapsResult - name_driver:', name_driver);
  console.log('createGoogleMapsResult - name_client:', name_client);

  // Validação básica dos parâmetros
  if (!origin || !destination || !response_api || !car || !id_driver || !name_driver || !name_client) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const [result]: any = await pool.query(
    'INSERT INTO google_maps_results (origin, destination, response_api, car, id_driver, name_driver, name_client) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [origin, destination, response_api, car, id_driver, name_driver, name_client]
  );

  if (!result || !result.insertId) {
    throw new Error('Erro ao inserir resultado do Google Maps');
  }

  return result.insertId;
};

export { createGoogleMapsResult };