const knex = require('../../db/db');

exports.deleteResumen = async (resumen_id) => {
  try {
    await knex('pasivo.resumen_concepto_costo').where({
      resumen_id,
    }).del();

    await knex('pasivo.resumen').where({
      resumen_id,
    }).del();
    return 'Success';
  }
  catch (e) {
    console.log('error from DB', e);
    return e;
  }
};
