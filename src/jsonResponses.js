const event = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getEvent = (request, response) => {
  const responseJSON = {
    event,
  };

  respondJSON(request, response, 200, responseJSON);
};

const addDate = (request, response, body) => {
  const responseJSON = {
    message: 'Name is required',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;
  if (event[body.name]) {
    responseCode = 204;
  } else {
    event[body.name] = {};
  }
  event[body.name].name = body.name;
  event[body.name].dates = body.date;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    console.log(`Event: ${event[body.name].name}`);
    console.log(`today: ${event[body.name].dates[0]}, date: `, event[body.name].dates[1]);

    // day
    const numDate1 = parseInt(event[body.name].dates[1].split('-')[2], 10);
    const numDate0 = parseInt(event[body.name].dates[0].split('-')[2], 10);
    console.log(`${numDate1 - numDate0} days until the date`);

    // month
    const numMonth1 = parseInt(event[body.name].dates[1].split('-')[1], 10);
    const numMonth0 = parseInt(event[body.name].dates[0].split('-')[1], 10);
    console.log(`${numMonth1 - numMonth0} months until the date`);

    // year
    const numyear1 = parseInt(event[body.name].dates[1].split('-')[0], 10);
    const numyear0 = parseInt(event[body.name].dates[0].split('-')[0], 10);
    console.log(`${numyear1 - numyear0} years until the date`);

    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  const responseCode = 404;
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  getEvent,
  addDate,
  notReal,
};
