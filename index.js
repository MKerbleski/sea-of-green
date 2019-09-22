const express = require('express');
const apiRouter = require('./server/apiRouter.js');
const path = require('path');

const server = express();
const port = process.env.PORT || 8080;

server.use(express.json());

server.use(express.static(path.join(__dirname, 'client/build')));

server.use('/api', apiRouter);

server.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(port, () => {
	console.log(`> Server is running on port: [${port}]`);
});
