const knex = require('../../db/db');

exports.saveConceptoToResumen = async (resumen_id, concepto_costo, monto, modo) => {
  let momento = '';
  if (modo === 'Pasivo') {
    momento = 'provision';
  }
  else if (modo === 'Ajuste') {
    momento = 'liquidacion';
  }
  try {
    const result = await knex('pasivo.resumen_concepto_costo').insert({
      concepto_costo,
      monto,
      resumen_id,
      momento,
    }).returning('*');
    console.log(result);
    return result;
  }
  catch (e) {
    console.log('error from DB', e);
    return e;
  }
};

exports.loadConceptoToResumen = async (resumen_id) => {
  try {
    const result = await knex.select('concepto_costo', 'monto').from('pasivo.resumen_concepto_costo').where({
      resumen_id,
    });
    return result;
  }
  catch (e) {
    console.log('error from DB', e);
    return e;
  }
};

exports.loadProvisionToResumen = async (mes, año, tipo) => {
  try {
    console.log('this is from loadProvisinToResumen', mes, año, tipo);
    const id = await knex.select('resumen_id').from('pasivo.resumen').where({
      mes,
      año,
      tipo,
      modo: 'Pasivo',
    });

    console.log('this is the id response', id[0].resumen_id);
    
    const result = await knex.select('concepto_costo', 'monto').from('pasivo.resumen_concepto_costo').where({
      resumen_id: id[0].resumen_id,
    });
    return result;
  }
  catch (e) {
    console.log('error from DB', e);
    return e;
  }
};
