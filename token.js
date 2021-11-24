import axios from 'axios';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

let animalKey = process.env.ANIMAL_KEY;
let animalSecret = process.env.ANIMAL_SECRET;
let animalTokenType = '';
let animalToken = '';

const region = 'us-east-2';
const secretName = 'name-generator';

const client = new AWS.SecretsManager({
  region,
});

if (!animalKey || !animalSecret) {
  client.getSecretValue({ SecretId: secretName }, (err, data) => {
    if (err) {
      if (
        err.code === 'DecryptionFailureException' ||
        err.code === 'InternalServiceErrorException' ||
        err.code === 'InvalidParameterException' ||
        err.code === 'InvalidRequestException' ||
        err.code === 'ResourceNotFoundException'
      )
        throw err;
    } else if ('SecretString' in data) {
      animalKey = JSON.parse(data.SecretString).ANIMAL_KEY;
      animalSecret = JSON.parse(data.SecretString).ANIMAL_SECRET;
    }
  });
}

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
