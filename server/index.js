const app = require('./app');

const db = require('../db');

console.log('** [server/index.js] Environment variables: ', process.env);
console.log('** [server/index.js] Environment variables: ', process.env.PORT);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
