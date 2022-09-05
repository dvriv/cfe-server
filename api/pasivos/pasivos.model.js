const knex = require('../../db/db');

// ******All of those are for adding the pasivo "resumenes". But they don't add the data inside them********
exports.addNewPasivo = async (proceso, tipo, modo, mes, año, notas) => {
  try {
    const result = await knex('pasivo.resumen').insert({
      proceso,
      tipo,
      modo,
      mes,
      año,
      notas,
    }).returning('*');
    console.log(result);
    return result;
  }
  catch (e) {
    console.log('error from DB', e);
    return e;
  }
};

exports.getPasivosBy = async (proceso = 'all', tipo = 'all', modo = 'all', mes = 'all', año = 'all', id) => {
  try {
    const result = await knex.select().from('pasivo.resumen').where({
      // This check if the values are not 'all' and if they are 'all' then they are not included
      // on the query obj because undefined/null values on the query result on a error on the db
      // this is done using '&&' because the right side only executes if the left side is true
      ...(proceso !== 'all' && { proceso }),
      ...(tipo !== 'all' && { tipo }),
      ...(modo !== 'all' && { modo }),
      ...(mes !== 'all' && { mes }),
      ...(año !== 'all' && { año }),
      ...(id && { resumen_id: id }), // This is checking if ID is not null to include it
    });
    console.log(result);

    const response = {
      data: result,
    };
    return response;
  }
  catch (e) {
    console.log('error with DB', e);
    const response = {
      error: true,
      message: 'error with server',
    };
    return response;
  }
};

exports.getPasivoByID = async (resumen_id) => {
  try {
    const result = await knex.select().from('pasivo.resumen').where({ resumen_id });
    const response = {
      data: result,
    };
    return response;
  }
  catch (e) {
    console.log('error with DB', e);
    const response = {
      error: 'Server error',
    };
    return response;
  }
};
