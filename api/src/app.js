const express = require('express');
const server = express();
server.use(express.json());
const users = require('./routes/users');
const post_persona = require('./routes/post_persona')

server.use('/users', users);
server.use('/persona', post_persona);

module.exports = server;