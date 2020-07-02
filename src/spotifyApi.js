const SpotifyWebApi = require('spotify-web-api-node');
// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: '8b13c63c4cad46fdaa133cb0b840f6cd',
  clientSecret: '4a67cda23106421f847ef3940cec8a9c',
  redirectUri: 'http://localhost:8080/callback',
});

export default spotifyApi;
