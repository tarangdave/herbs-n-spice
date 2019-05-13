const fetch = require('node-fetch');

const url = 'http://localhost:3000/add-ingredients';
fetch(url, { method: 'PUT' })
    .then((res) => res.json()) // expecting a json response
    .then((json) => console.log(json));
