const express = require('express');
const generateTxt = require('./generateTxt');

// const pasivoModel = require('./pasivos.model');

const generateTxtRouter = express.Router();

/*
const inputDataTotals = {
  '234K1': 7684068.84,
  '234K7': 6166172.49,
  '2342G': 2911471.52,
};

const inputNumberData = {
  91: 2617312.31,
  '9G': 684688.79,
  92: 1240059.88,
  '9I': 442876.56,
  93: 1990526.66,
  94: 708604.64,
  95: 2911471.52,
  '9E': 4543496.40,
  '9O': 1622676.09,
};
*/

generateTxtRouter.route('/')
  .post((req, res) => {
    console.log('body', req.body);
    const {
      cuentasContables,
      cuentasMayor,
      metadata,
    } = req.body;
    const response = generateTxt.generateFile(cuentasContables, cuentasMayor, metadata);
    const result = { name: response };
    res.status(200).send(result);
  })
  .get((req, res) => {
    const { archivo } = req.query;
    if (!archivo) {
      res.send('Nombre de archivo incorrecto');
    }
    const file = `/tmp/${archivo}.txt`;
    res.download(file);
  });

module.exports = generateTxtRouter;
