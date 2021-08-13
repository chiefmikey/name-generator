import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const animalKey = process.env.ANIMAL_KEY;
const animalSecret = process.env.ANIMAL_SECRET;
let animalTokenType = '';
let animalToken = '';

const animalAccess = () =>
  new Promise((resolve) => {
    const access = {
      method: 'post',
      url: 'https://api.petfinder.com/v2/oauth2/token',
      data: `grant_type=client_credentials&client_id=${animalKey}&client_secret=${animalSecret}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    axios(access)
      .then((getAccess) => {
        animalTokenType = getAccess.data.token_type;
        animalToken = getAccess.data.access_token;
        resolve({ animalTokenType, animalToken });
      })
      .catch((error) => console.error('error in access request', error));
  });

export default {
  animalAccess,
  animalTokenType,
  animalToken,
};
