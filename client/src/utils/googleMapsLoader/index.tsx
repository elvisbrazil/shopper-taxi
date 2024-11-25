import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'AIzaSyDMVx3FFiM8DNbbg-XEXZu8S_mc7wEQIkQ',
  version: "weekly",
  libraries: ["places"]
});

export default loader;