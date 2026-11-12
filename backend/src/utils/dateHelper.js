// src/utils/dateHelper.js
const moment = require('moment');

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const formatTime = (time) => {
  return moment(time, 'HH:mm').format('hh:mm A');
};

module.exports = { formatDate, formatTime };
