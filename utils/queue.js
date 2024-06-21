const Bull = require('bull');

// Create a queue named 'fileQueue' and 'userQueue'
const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

module.exports = { fileQueue };
