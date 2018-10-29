const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

const serverRequest = (req, res) => {
	let buffer = '';
	const parsedUrl = url.parse(req.url, true),
		path = parsedUrl.pathname,
		trimmedPath = path.replace(/^\/+|\/+$/g, ''),
		queryStringObject = parsedUrl.query,
		method = req.method.toLowerCase(),
		headers = req.headers;

	const decoder = new stringDecoder('utf-8');

	req.on('data', data => {
		buffer += decoder.write(data);
	});

	req.on('end', () => {
		buffer += decoder.end();
	});

	const data = {
		trimmedPath,
		queryStringObject,
		method,
		headers,
		payload: buffer
	};

	const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handler.error;

	chosenHandler(data, (statusCode, payload) => {
		statusCode = typeof statusCode === 'number' ? statusCode : 200;
		payload = typeof payload === 'object' ? payload : {};
		const payloadString = JSON.stringify(payload);

		res.setHeader('Content-Type', 'application/json');
		res.writeHead(statusCode);
		res.end(payloadString);
	});
};

const handler = {};

handler.hello = (data, callback) => {
	callback(200, { helloMessage: 'Get out of my house!' });
};

handler.error = (data, callback) => {
	callback(404);
};

const router = {
	hello: handler.hello
};

module.exports = serverRequest;
