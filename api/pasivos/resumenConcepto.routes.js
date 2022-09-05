const express = require('express');
const { saveConceptoToResumen, loadConceptoToResumen, loadProvisionToResumen} = require('./resumenConcepto.model');

const resumenConceptoRouter = express.Router();

resumenConceptoRouter.route('/')
  .post(async (req, res) => {
    console.log(req.body);
    const { resumen_id } = req.body;
    const { modo } = req.body;
    const { resumenObj } = req.body;

    for (var key in resumenObj) {
      if (resumenObj.hasOwnProperty(key)) {
        console.log(key + " -> " + resumenObj[key]);
        const result = saveConceptoToResumen(resumen_id, key, resumenObj[key], modo);
      }
    }
    // resumenConceptoModel()
  })
  .get(async (req, res) => {
    const { resumen_id } = req.query;
    const { modo } = req.query;
    const { tipo } = req.query;
    const { mes } = req.query;
    const { año } = req.query;

    if (modo === 'provision') {
      try {
        const response = await loadProvisionToResumen(mes, año, tipo);
        if (response.error) {
          console.log('error 500', response);
          res.status(500).send(response);
        }
        else {
          console.log(response);
          res.status(200).send(response);
        }
      }
      catch (e) {
        console.log('error on .get', e);
      }
    }
    else {
      try {
        const response = await loadConceptoToResumen(resumen_id);
        if (response.error) {
          console.log('error 500', response);
          res.status(500).send(response);
        }
        else {
          console.log(response);
          res.status(200).send(response);
        }
      }
      catch (e) {
        console.log('error on .get', e);
      }
    }
  });

module.exports = resumenConceptoRouter;

