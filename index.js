const axios = require('axios');
const crypto = require('crypto');
const OAuth = require('oauth');

// acquire variables from .env, globally
require('dotenv').config();

const {
  NOOK_API_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_TOKEN,
  TWITTER_TOKEN_SECRET,
} = process.env;

// eslint-disable-next-line
const encodeData = OAuth.OAuth.prototype._encodeData;

const callTomNook = async () => {
  const response = await axios.get(`https://nookipedia.com/api/today/?api_key=${NOOK_API_KEY}`);
  return response.data;
};

const replyWithMedia = async (tweetId, oauth, villager, media) => {
  const villagerFullInfo = await axios.get(`https://nookipedia.com/api/villager/${villager}/?api_key=${NOOK_API_KEY}`);
  const { favclothing, favcolor, gender, personality, species } = villagerFullInfo.data;
  oauth.post(
    `https://api.twitter.com/1.1/statuses/update.json?status=${encodeData(`@villagerbdays This is ${villager}! ${gender === 'Female' ? 'She' : 'He'} likes the color ${favcolor.toLowerCase()}, ${favclothing.toLowerCase()} clothing, and is a ${personality.toLowerCase()} ${species.toLowerCase()}.`)}&in_reply_to_status_id=${tweetId}&media_ids=${media.toString()}`,
    TWITTER_TOKEN,
    TWITTER_TOKEN_SECRET,
    '',
    (e) => {
      if (e) console.error(e);
    },
  );
};

const getMediaIds = async (id, oauth, villagers, images) => {
  const resp = await axios({
    baseURL: images[0],
    method: 'get',
    responseType: 'arraybuffer',
  });
  villagers.forEach((vil) => {
    oauth.post(
      'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
      TWITTER_TOKEN,
      TWITTER_TOKEN_SECRET,
      {
        media_data: resp.data.toString('base64'),
      },
      'application/octet-stream',
      (e, data) => {
        if (e) console.error(e);
        const media = JSON.parse(data).media_id_string;
        setTimeout(() => replyWithMedia(id, oauth, vil, media), 3000);
      },
    );
  });
};


const createStatus = (oauth, status, villagers, images) => {
  oauth.post(
    `https://api.twitter.com/1.1/statuses/update.json?status=${encodeData(status)}`,
    TWITTER_TOKEN,
    TWITTER_TOKEN_SECRET,
    '',
    (e, data) => {
      if (e) console.error(e);
      const { id_str: id } = JSON.parse(data);
      getMediaIds(id, oauth, villagers, images);
    },
  );
};

const createPost = async () => {
  const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    '1.0A',
    'oob',
    'HMAC-SHA1',
  );

  const { events, villager_images: images } = await callTomNook();

  const birthdays = events.filter((evt) => (
    evt.split(' ').includes('birthday!')
  ));

  const villagers = birthdays[0].split(' ').filter((vil) => !['Today', 'is', 'and', 'birthday!'].includes(vil)).map((vil) => vil.replace('\'s', ''));

  createStatus(oauth, birthdays, villagers, images);
};

createPost('test3');
// make Nookipedia API Call
// assign villager_images to villagerImages
// parse events for birthday

// for each villager image, capture buffers
// for each buffer, create axios api call
// store media_ids in mediaIds

// make twitter API call
