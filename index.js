const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const pasivosRouter = require('./api/pasivos/pasivos.routes');
const resumenConceptoRouter = require('./api/pasivos/resumenConcepto.routes');
const generateTxtRouter = require('./api/generateTxt/generateTxt.routes');
const deleteResumenRouter = require('./api/pasivos/deleteResumen.routes');


//  Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


//  API Routes
app.use('/api/pasivos', pasivosRouter);
app.use('/api/resumenConcepto', resumenConceptoRouter);
app.use('/api/generateTxt', generateTxtRouter);
app.use('/api/deleteResumen', deleteResumenRouter);

// Not sure if this needed, is supposed to catch all unhandled errors


const server = app.listen(port, () => console.log(`Listening on port ${server.address().port}`));
