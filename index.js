const axios = require('axios');
const crypto = require('crypto');

// acquire variables from .env, globally
require('dotenv').config();

const {
  NOOK_API_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_TOKEN,
  TWITTER_TOKEN_SECRET,
} = process.env;



// collect parameters: if media, no include_entities or status
// include_entities: true, oauth_consumer_key, oauth_nonce,
// oauth_signature_method: HMAC-SHA1, oauth_timestamp,
// oauth_token, oauth_token_secret, oauth_version: 1.0,
// status,
// take these, create parameter string with key=value&key=value etc.

const collectParameters = (isMedia, status) => {
  const nonce = crypto.randomBytes(32).toString('base64');
  const parameterString = `${isMedia ? null : 'include_entities=true&'}oauth_consumer_key=${TWITTER_CONSUMER_KEY}&oauth_consumer_secret=${TWITTER_CONSUMER_SECRET}&oauth_nonce=${nonce}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${new Date().getTime()}&oauth_token=${TWITTER_TOKEN}&oauth_token_secret=${TWITTER_TOKEN_SECRET}&oauth_version=1.0${isMedia ? null : `&status=${encodeURIComponent(status).replace('!', 
    '%21')}`}`;
  return parameterString;
};



// signature base string:
// method: POST
// percent encoded URL
// percent encoded parameter string
// delimit these with &

// signing key:
// consumer secret + oauth token secret
// percent encode both, delimit with &

// create signature:
// use const hmac = crypto.createHmac('sha1', signingKey);
// hmac.update(signatureBaseString);
// const signature = hmac.digest('base64');

// make Nookipedia API Call
// assign villager_images to villagerImages
// parse events for birthday

// for each villager image, capture buffers
// for each buffer, create axios api call
// store media_ids in mediaIds

// make twitter API call
