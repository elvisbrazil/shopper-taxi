import axios from 'axios';

const getRouteDetails = async (origin: string, destination: string) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

  const response = await axios.get(url);
  return response.data;
};

export default getRouteDetails;