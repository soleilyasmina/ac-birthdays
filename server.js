const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { createPost } = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors());

app.post('/daily', async (_req, res) => {
  await createPost();
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
