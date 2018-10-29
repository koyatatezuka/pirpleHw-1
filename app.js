const http = require('http');

const serverRequest = require('./serverRequest');

const PORT = 3000;

http.createServer(serverRequest).listen(PORT)