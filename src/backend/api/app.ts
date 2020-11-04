import express from 'express';
import bodyParser from 'body-parser';

import {checkIfAllTablesExist, connect} from './database';

const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
connect();
checkIfAllTablesExist();



app.listen(port, () => console.log(`Example App running on http://localhost:${port}/`));

app.get('/', (req, res) =>
{
   res.send("hello world");
});
