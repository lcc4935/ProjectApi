// Requests
const handleResponse = (xhr, parseResponse) => {
    const content = document.querySelector('#content');
    const countdown = document.querySelector('#countdown');
    const tDate = document.querySelector('#todayDate');
    const eDate = document.querySelector('#eventDate');

    const days = document.querySelector('#days');
    const months = document.querySelector('#months');
    const years = document.querySelector('#years');

    let obj = '';
    switch (xhr.status) {
        //success
        case 200:
            obj = parseJSON(xhr)
            console.log(obj);
            //formating, reference: https://www.freecodecamp.org/news/javascript-date-now-how-to-get-the-current-date-in-javascript/

            //today date

            const dateNow = Date.now();
            const today = new Date(dateNow);
            const todayDate = today.toLocaleDateString();

            todaySplit = todayDate.split('/');
            //day
            const todayDay = todaySplit[1];
            //month
            const todayMonth = todaySplit[0];
            //year
            const todayYear = todaySplit[2];


            //event date

            const eventDate = obj.date;
            eventSplit = eventDate.split('-');
            //day
            const eventDay = eventSplit[2];
            //month
            const eventMonth = eventSplit[1];
            //year
            const eventYear = eventSplit[0];

            //the math

            //https://date-fns.org/ - library
            //import { interval } from 'date-fns'

            //years, months, days, hours, minutes, seconds
            //   let duration = interval.intervalToDuration({
            //       start: new Date(todayYear, todayMonth, todayDay, 0, 0, 0),
            //       end: new Date(eventYear, eventMonth, eventDay, 0, 0, 0)
            //   });



            //https://www.npmjs.com/package/date-interval-comparator

            // let comparator = require('date-interval-comparator');
            // let A = ["06/05/2015", "06/10/2015"];
            // let B = ["05/05/2015", "05/10/2015"];
            // comparator.compare(A, B);
            // console.log(comparator.compare(A, B));


            //THIS ONE
            //https://www.npmjs.com/package/datetime-types
            //npm i datetime-types

            //https://github.com/aholstenson/datetime-types/blob/master/src/DateInterval.ts

            // import { LocalDate, DateInterval } from 'datetime-types';

            // const dateHopeWork = LocalDate.of(2021, 10, 2);
            // const dateHopeWork2 = LocalDate.of(2022, 11, 3);
            // const time = DateInterval.from({
            //     start: dateHopeWork,
            //     end: dateHopeWork2
            // });

            // console.log(time);

            const countdownDay = eventDay - todayDay;
            const countdownMonth = eventMonth - todayMonth;
            const countdownYear = eventYear - todayYear;

            //Month names
            let tMonth;
            if (todayMonth == 1) {
                tMonth = "January";
            } else if (todayMonth == 2) {
                tMonth = "February";
            } else if (todayMonth == 3) {
                tMonth = "March";
            } else if (todayMonth == 4) {
                tMonth = "April";
            } else if (todayMonth == 5) {
                tMonth = "May";
            } else if (todayMonth == 6) {
                tMonth = "June";
            } else if (todayMonth == 7) {
                tMonth = "July";
            } else if (todayMonth == 8) {
                tMonth = "August";
            } else if (todayMonth == 9) {
                tMonth = "September";
            } else if (todayMonth == 10) {
                tMonth = "October";
            } else if (todayMonth == 11) {
                tMonth = "November";
            } else if (todayMonth == 12) {
                tMonth = "December";
            }

            let eMonth;
            if (eventMonth == 1) {
                eMonth = "January";
            } else if (eventMonth == 2) {
                eMonth = "February";
            } else if (eventMonth == 3) {
                eMonth = "March";
            } else if (eventMonth == 4) {
                eMonth = "April";
            } else if (eventMonth == 5) {
                eMonth = "May";
            } else if (eventMonth == 6) {
                eMonth = "June";
            } else if (eventMonth == 7) {
                eMonth = "July";
            } else if (eventMonth == 8) {
                eMonth = "August";
            } else if (eventMonth == 9) {
                eMonth = "September";
            } else if (eventMonth == 10) {
                eMonth = "October";
            } else if (eventMonth == 11) {
                eMonth = "November";
            } else if (eventMonth == 12) {
                eMonth = "December";
            }

            //displaying
            console.log(`TodayDays: ${todayDate} y: ${todayYear} m: ${todayMonth} d: ${todayDay}`);
            console.log(`EventDays: ${eventDate} y: ${eventYear} m: ${eventMonth} d: ${eventDay}`);

            //countdown.innerHTML = `${countdownYear} years, ${countdownMonth} months, and ${countdownDay} days away.`;
            tDate.innerHTML = `Today's Date : <br>${tMonth} ${todayDay}, ${todayYear}`;
            eDate.innerHTML = `Event's Date: <br>${eMonth} ${eventDay}, ${eventYear}`;
            countdown.innerHTML = `${obj.name}`;
            days.innerHTML = `${countdownDay}`;
            months.innerHTML = `${countdownMonth}`;
            years.innerHTML = `${countdownYear}`;
            //countdown.innerHTML = `<b>Event: ${obj.name} on ${eventDate} is ${duration} away.</b>`;


            break;
        //created
        case 201:
            //Add event to list
            let events = document.querySelector('#eventField');
            let option = document.createElement('OPTION');
            option.innerHTML = document.querySelector('#nameField').value;
            option.value = document.querySelector('#nameField').value;
            events.options.add(option);
            content.innerHTML = `<b>Event has been Created</b>`;
            break;
        //update
        case 204:
            content.innerHTML = `<b>Event Updated</b>`;
            parseResponse = false;
            break;
        //bad request
        case 400:
            obj = parseJSON(xhr)
            content.innerHTML = `<b>${obj.message}</b>`;
            break;
        //not found
        case 404:
            content.innerHTML = `<b>Page Not Found</b>`;
            break;
    }
};

//Parse JSON
const parseJSON = (xhr) => {
    const obj = JSON.parse(xhr.response);

    return obj;
};

//Get
const getRequest = (e, eventForm) => {
    let url = eventForm.getAttribute('action');

    let selection = document.querySelector('#eventField');
    let name = selection.options[selection.selectedIndex].value;
    url += `?name=${name}`;

    const method = eventForm.getAttribute('method');

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application.json');

    xhr.onload = () => handleResponse(xhr, true);

    xhr.send();

    e.preventDefault(e);
    return false;
}

//Post
const sendPost = (e, nameForm, update) => {
    let nameAction = '';
    let nameField = '';

    if (update) {
        nameAction = '/updateEvent';
        nameField = document.querySelector('#eventField');
    } else {
        nameAction = nameForm.getAttribute('action');
        nameField = nameForm.querySelector('#nameField');
    }

    const nameMethod = nameForm.getAttribute('method');



    const dateField = nameForm.querySelector('#dateField');

    const xhr = new XMLHttpRequest();

    xhr.open(nameMethod, nameAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr, true);


    const formData = `name=${nameField.value}&date=${dateField.value}`;
    xhr.send(formData);

    e.preventDefault();
    return false;
};

//Adds to dropdown
const initGet = () => {
    let url = '/getAll';

    const method = 'GET';

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application.json');

    xhr.onload = () => populateMenu(xhr);

    xhr.send();

    return false;
};

const populateMenu = (xhr) => {
    let obj = parseJSON(xhr)
    let events = document.querySelector('#eventField');
    Object.keys(obj.events).forEach(key => {
        let option = document.createElement('OPTION');
        option.innerHTML = key;
        events.options.add(option);
    });
};

const genInput = (dateVar) => {
    let dateField = nameForm.querySelector('#dateField');
    dateField.value = dateVar;
}

const init = () => {
    const nameForm = document.querySelector('#nameForm');

    const addEvent = (e) => sendPost(e, nameForm, false);
    const updateEvent = (e) => sendPost(e, nameForm, true);

    const addButton = document.querySelector('#addButton');
    const removeButton = document.querySelector('#removeButton');


    nameForm.addEventListener('submit', addEvent);

    const eventForm = document.querySelector('#eventForm');
    const getEvent = (e) => getRequest(e, eventForm);
    eventForm.addEventListener('submit', getEvent);

    const btn = eventForm.querySelector('#updateButton');
    btn.addEventListener('click', updateEvent);

    initGet();
}

window.onload = init;