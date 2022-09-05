const express = require('express');
const { deleteResumen } = require('./deleteResumen.model');

const deleteResumenRouter = express.Router();

deleteResumenRouter.route('/')
  .get(async (req, res) => {
    const { resumen_id } = req.query;
    try {
      const response = await deleteResumen(resumen_id);
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
  });


module.exports = deleteResumenRouter;
