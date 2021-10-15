// https://date-fns.org/ - library
const intervalToDuration = require('date-fns/intervalToDuration');

const events = {};

// JSON Body
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// JSON Body, response & status
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Event
const getEvent = (request, response, body) => {
  let responseJSON = {

  };
  if (!(body.name in events)) {
    responseJSON.id = 'notFound';
    responseJSON.message = 'Event does not exist';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (body.name in events) {
    responseJSON = events[body.name];
    return respondJSON(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

// Meta
const getEventMeta = (request, response) => respondJSONMeta(request, response, 204);

// Event All
const getAll = (request, response) => {
  const responseJSON = {
    events,
  };

  respondJSON(request, response, 200, responseJSON);
};

// Adds event, Head
const addEvent = (request, response, body) => {
  const responseJSON = {
    message: 'Requires a name and date',
  };
  if (!body.name || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (body.name in events) {
    responseJSON.message = 'Event already exists';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // years, months, days, hours, minutes, seconds
  // const duration = intervalToDuration({
  //   start: new Date(2021, 12, 21, 0, 0, 0),
  //   end: new Date(2022, 4, 15, 0, 0, 0),
  // });

  // console.log(duration);

  // Event object
  events[body.name] = {
    name: body.name,
    date: body.date,
  };

  // Event Date

  const eventDate = events[body.name].date;
  const eventSplit = eventDate.split('-');
  // day
  const eventDay = eventSplit[2];
  // month
  const eventMonth = eventSplit[1];
  // year
  const eventYear = eventSplit[0];

  const dateEnd = new Date(eventYear, eventMonth, eventDay, 0, 0, 0);

  // Today date

  const dateNow = Date.now();
  const today = new Date(dateNow);
  const todayDate = today.toLocaleDateString();

  const todaySplit = todayDate.split('/');
  // day
  const todayDay = todaySplit[1];
  // month
  const todayMonth = todaySplit[0];
  // year
  const todayYear = todaySplit[2];

  const dateStart = new Date(todayYear, todayMonth, todayDay, 0, 0, 0);

  const duration = intervalToDuration({
    start: dateStart,
    end: dateEnd,
  });

  events[body.name].duration = duration;

  // events[body.name].duration.end = new Date(eventYear, eventMonth, eventDay, 0, 0, 0);

  // console.log(events[body.name].date);

  responseJSON.message = 'Event created';
  return respondJSON(request, response, 201, responseJSON);
};

// Update
const updateEvent = (request, response, body) => {
  const responseJSON = {
    message: 'Event was not found',
  };
  if (!(body.name in events)) {
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 400, responseJSON);
  }

  const responseCode = 204;
  events[body.name].date = body.date;

  return respondJSONMeta(request, response, responseCode);
};

// 404
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  const responseCode = 404;
  return respondJSON(request, response, responseCode, responseJSON);
};

// Head 404
const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getEvent,
  addEvent,
  getAll,
  updateEvent,
  notReal,
  getEventMeta,
  notRealMeta,
};
