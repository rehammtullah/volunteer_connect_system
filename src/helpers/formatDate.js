// helper/formatDate.js

const moment = require('moment');

function formatMessage(username, text,email) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),email,
    date:moment().format('DD-MM-YYYY')
  };
}

module.exports = formatMessage;