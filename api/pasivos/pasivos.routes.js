const express = require('express');
const pasivoModel = require('./pasivos.model');

const pasivosRouter = express.Router();

pasivosRouter.route('/')
  .post(async (req, res) => {
    console.log('body', req.body);
    const { proceso } = req.body;
    const { tipo } = req.body;
    const { modo } = req.body;
    const { mes } = req.body;
    const { año } = req.body;
    const { notas } = req.body;

    try {
      const response = await pasivoModel.addNewPasivo(proceso, tipo, modo, mes, año, notas);
      res.status(200).send(response);
    }
    catch (e) {
      console.log(e);
    }
  })

  .get(async (req, res) => {
    const { proceso } = req.query;
    const { tipo } = req.query;
    const { modo } = req.query;
    const { mes } = req.query;
    const { año } = req.query;
    const { id } = req.query;

    try {
      const response = await pasivoModel.getPasivosBy(proceso, tipo, modo, mes, año, id);
      if (response.error) {
        console.log('error 500', response);
        res.status(500).send(response);
      }
      else {
        res.status(200).send(response);
      }
    }
    catch (e) {
      console.log('error on .get', e);
    }
  });

module.exports = pasivosRouter;

