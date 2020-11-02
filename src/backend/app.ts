const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

app.listen(port, () => console.log(`Example App running on http://localhost:${port}/`));



