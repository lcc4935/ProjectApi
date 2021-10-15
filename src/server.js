const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  const body = [];

  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    if (parsedUrl.pathname === '/addEvent') {
      jsonHandler.addEvent(request, response, bodyParams);
    } else {
      jsonHandler.updateEvent(request, response, bodyParams);
    }
  });
};

// Get
const handleGet = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.query);
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/client.js') {
    htmlHandler.getJS(request, response);
  } else if (parsedUrl.pathname === '/getEvent') {
    jsonHandler.getEvent(request, response, params);
  } else if (parsedUrl.pathname === '/getAll') {
    jsonHandler.getAll(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};

// Head
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getEvent' || parsedUrl.pathname === '/getAll') {
    jsonHandler.getEventMeta(request, response);
  } else {
    jsonHandler.notRealMeta(request, response);
  }
};

// Requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
