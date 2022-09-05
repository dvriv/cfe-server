const fs = require('fs');
const centrosDeCosto = require('./centrosDeCosto');
const centrosDeCostoFarallon = require('./centrosDeCostoFarallon');

function toFixed(num, fixed) {
  if (!num) {
    return 0;
  }
  const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}


const convertTo14Number = (realNumber) => {
  console.log(realNumber);
  const realNumberNumber = Number(toFixed(Number(realNumber), 2));
  const absoluteNumber = Math.abs(realNumberNumber);
  const splitNumber = absoluteNumber.toString().split('.');
  const finalNumberArray = [];
  if (!splitNumber[1] || splitNumber[1].length === 0) {
    finalNumberArray.push('0', '0');
  }
  else {
    for (let i = 0; i < splitNumber[1].length; i += 1) {
      finalNumberArray.push(splitNumber[1].charAt(i));
      if (splitNumber[1].length === 1) {
        finalNumberArray.push('0');
      }
    }
  }
  finalNumberArray.unshift(splitNumber[0]);
  const numberOfUselessZeros = 12 - splitNumber[0].length;
  for (let i = 0; i < numberOfUselessZeros; i += 1) {
    finalNumberArray.unshift('0');
  }
  const finalNumber = finalNumberArray.join('');
  return finalNumber;
};

const MultiplicateForEveryCentroDeCosto = (costoName, costoAmount, dba, ajuste) => {
  let string = '';
  let total = 0;
  for (let obj of centrosDeCosto.centrosDeCosto) {
    let number = parseFloat((costoAmount * obj.porcentaje).toFixed(2));
    total += number;
    if (obj.areaDeResponsabilida === 'BA503') {
      let diferencia = costoAmount - total;
      number = parseFloat(number + diferencia).toFixed(2);
    }
    string += `${dba}${obj.areaDeResponsabilida}${obj.numeroRaro}${costoName}${insertChar(47)}${convertTo14Number(number)} ${cargoOabonoCuenta(number, ajuste)} 2\n`;
  }
  return { string, total };
}

const MultiplicateForEveryCentroDeCostoFarallon = (costoName, costoAmount, dba, ajuste) => {
  let string = '';
  let total = 0;
  for (let obj of centrosDeCostoFarallon.centrosDeCosto) {
    let number = parseFloat((costoAmount * obj.porcentaje).toFixed(2));
    total += number;
    if (obj.areaDeResponsabilida === 'BA752') {
      let diferencia = costoAmount - total;
      number = parseFloat(number + diferencia).toFixed(2);
    }
    string += `${dba}${obj.areaDeResponsabilida}${obj.numeroRaro}${costoName}${insertChar(47)}${convertTo14Number(number)} ${cargoOabonoCuenta(number, ajuste)} 2\n`;
  }
  return { string, total };
}

const insertChar = (nTimes) => {
  let string = '';
  for (let i = 0; i < nTimes; i += 1) {
    string += ' ';
  }
  return string;
};

const formatMonthAndYear = (año, mes) => {
  const añoText = año.toString();
  const mesText = mes.toString();
  let string = añoText[2] + añoText[3];
  if (mesText.length === 1) {
    string += `0${mesText}`;
  }
  else {
    string += mesText;
  }
  return string;
};

const cargoOabonoMayor = (number, ajuste) => {
  if (ajuste) {
    if (Math.sign(number) === 1) { // 1 === positive, -1 negative, 0 = 0 positivo, -0 = 0 negativo
      return '1';
    }
    return '9';
  }
  if (Math.sign(number) === 1) {
    return '9';
  }
  return '1';
};

const cargoOabonoCuenta = (number, ajuste) => {
  if (ajuste) {
    if (Math.sign(number) === 1) {
      return '9';
    }
    return '1';
  }
  if (Math.sign(number) === 1) {
    return '1';
  }
  return '9';
};

const generateFileTxtPasivoOperacion = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  const fileName = `PASOPE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   PASIVO IMSS OPERA ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K1${insertChar(47)}${convertTo14Number(cuentasMayor['234K1'])} 9 2\n`;
  data += `${dba}BA0002342G${insertChar(47)}${convertTo14Number(cuentasMayor['2342G'])} 9 2\n`;
  data += `${dba}BA000234K7${insertChar(47)}${convertTo14Number(cuentasMayor['234K7'])} 9 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, false)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
    }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(Number(cuentasMayor['234K1']) + Number(cuentasMayor['2342G']) + Number(cuentasMayor['234K7']))}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtPasivoEventual = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  const fileName = `PASEVE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   PASIVO IMSS EVENT ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K4${insertChar(47)}${convertTo14Number(cuentasMayor['234K4'])} 9 2\n`;
  data += `${dba}BA0002342G${insertChar(47)}${convertTo14Number(cuentasMayor['2342G'])} 9 2\n`;
  data += `${dba}BA000234K7${insertChar(47)}${convertTo14Number(cuentasMayor['234K7'])} 9 2\n`;
  data += `${dba}BA0002342A${insertChar(47)}${convertTo14Number(cuentasMayor['2342A'])} 9 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, false)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
    }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(Number(cuentasMayor['234K4']) + Number(cuentasMayor['2342G']) + Number(cuentasMayor['234K7']) + Number(cuentasMayor['2342A']))}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtAjusteOperacion = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  console.log(cuentasContables);
  const fileName = `AJUSTOPE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   AJUSTE IMSS OPERA ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K1${insertChar(47)}${convertTo14Number(cuentasMayor['234K1'])} ${cargoOabonoMayor(cuentasMayor['234K1'], true)} 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, true)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
      }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(cuentasMayor['234K1'])}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtAjusteEventual = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  console.log(cuentasContables);
  const fileName = `AJUSTEVE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   AJUSTE IMSS EVENT ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K4${insertChar(47)}${convertTo14Number(cuentasMayor['234K4'])} ${cargoOabonoMayor(cuentasMayor['234K4'], true)} 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, true)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
      }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(cuentasMayor['234K4'])}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtAjusteEventualBimestre = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  console.log(cuentasContables);
  const fileName = `AJUSTEVE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   AJUSTE IMSS EVENT ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K4${insertChar(47)}${convertTo14Number(cuentasMayor['234K4'])} ${cargoOabonoMayor(cuentasMayor['234K4'], true)} 2\n`;
  data += `${dba}BA0002342G${insertChar(47)}${convertTo14Number(cuentasMayor['2342G'])} ${cargoOabonoMayor(cuentasMayor['2342G'], true)} 2\n`;
  data += `${dba}BA000234K7${insertChar(47)}${convertTo14Number(cuentasMayor['234K7'])} ${cargoOabonoMayor(cuentasMayor['234K7'], true)} 2\n`;
  data += `${dba}BA0002342A${insertChar(47)}${convertTo14Number(cuentasMayor['2342A'])} ${cargoOabonoMayor(cuentasMayor['2342A'], true)} 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, true)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
      }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(Number(cuentasMayor['234K4']) + Number(cuentasMayor['2342G']) + Number(cuentasMayor['234K7']) + Number(cuentasMayor['2342A']))}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtAjusteOperacionBimestre = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  console.log(cuentasContables);
  const fileName = `AJUSTOPE${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   AJUSTE IMSS OPERA ${monthText}/${año}${insertChar(45)}1\n`;
  data += `${dba}BA000234K1${insertChar(47)}${convertTo14Number(cuentasMayor['234K1'])} ${cargoOabonoMayor(cuentasMayor['234K1'], true)} 2\n`;
  data += `${dba}BA0002342G${insertChar(47)}${convertTo14Number(cuentasMayor['2342G'])} ${cargoOabonoMayor(cuentasMayor['2342G'], true)} 2\n`;
  data += `${dba}BA000234K7${insertChar(47)}${convertTo14Number(cuentasMayor['234K7'])} ${cargoOabonoMayor(cuentasMayor['234K7'], true)} 2\n`;

  for (let property in cuentasContables) {
    if (Object.prototype.hasOwnProperty.call(cuentasContables, property)) {
      if (cuentasContables[property] !== 0) {
        const formatedNumber = MultiplicateForEveryCentroDeCosto(property, cuentasContables[property], dba, true)
        data += `${formatedNumber.string}`;
        console.log('Total: ' + formatedNumber.total)
      }
    }
  }

  data += `${dba}${insertChar(57)}${convertTo14Number(Number(cuentasMayor['234K1']) + Number(cuentasMayor['2342G']) + Number(cuentasMayor['234K7']))}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtPasivoLaboral = (cuentasMayor, poliza, monthText, año, monthAndYear) => {
  const fileName = `PASLAB${monthAndYear}${poliza}`;
  const cuentaMayor = (parseFloat(cuentasMayor.clv)).toFixed(2);
  console.log(cuentaMayor);
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   PASIVO LABORAL ${monthText}/${año}${insertChar(48)}1\n`;
  data += `${dba}BA00036111${insertChar(47)}${convertTo14Number(cuentasMayor.clv)} 9 2\n`;

  const formatedNumber = MultiplicateForEveryCentroDeCosto('2L', cuentaMayor, dba);
  data += `${formatedNumber.string}`;
  console.log('Total: ' + formatedNumber.total)

  data += `${dba}${insertChar(57)}${convertTo14Number(cuentaMayor)}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};

const generateFileTxtImpNomina = (cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear) => {
  const fileName = `IMPNOM${monthAndYear}${poliza}`;
  const dba = `DBA${monthAndYear}${poliza}`;
  let data = `${dba}   PASIVO 3% S/NOM ${monthText}/${año}${insertChar(47)}1\n`;
  data += `${dba}BA0002342F${insertChar(47)}${convertTo14Number(cuentasMayor.totalOperacion)} 9 2\n`;
  data += `${dba}BA7502342F${insertChar(47)}${convertTo14Number(cuentasMayor.totalFarallon)} 9 2\n`;

  let formatedNumber = '';
  formatedNumber = MultiplicateForEveryCentroDeCosto('U2', cuentasContables.impNominaOperacion, dba, false);
  data += `${formatedNumber.string}`;
  formatedNumber = MultiplicateForEveryCentroDeCosto('5C', cuentasContables.fomentoEducacionOperacion, dba, false);
  data += `${formatedNumber.string}`;
  formatedNumber = MultiplicateForEveryCentroDeCostoFarallon('U2', cuentasContables.impNominaFarallon, dba, false);
  data += `${formatedNumber.string}`;
  formatedNumber = MultiplicateForEveryCentroDeCostoFarallon('5C', cuentasContables.fomentoEducacionFarallon, dba, false);
  data += `${formatedNumber.string}`;
  //  Total
  data += `${dba}${insertChar(57)}${convertTo14Number(Number(cuentasMayor.totalOperacion) + Number(cuentasMayor.totalFarallon))}   C`;

  fs.writeFileSync(`/tmp/${fileName}.txt`, data);
  return fileName;
};


exports.generateFile = (cuentasContables, cuentasMayor, metadata) => {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const poliza = parseInt(metadata.resumen_id, 10) + 100000;
  const { proceso } = metadata;
  const { tipo } = metadata;
  const { modo } = metadata;
  const { año } = metadata;
  const { mes } = metadata;

  const monthAndYear = formatMonthAndYear(año, mes);
  const monthText = months[mes - 1];

  if (proceso === 'cuotasIMSS' && modo === 'Pasivo' && tipo === 'Operacion') {
    return generateFileTxtPasivoOperacion(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'cuotasIMSS' && modo === 'Pasivo' && tipo === 'Eventual') {
    return generateFileTxtPasivoEventual(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'cuotasIMSS' && modo === 'Ajuste' && tipo === 'Operacion' && (mes % 2) === 1) {
    return generateFileTxtAjusteOperacion(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'cuotasIMSS' && modo === 'Ajuste' && tipo === 'Operacion' && (mes % 2) === 0) {
    return generateFileTxtAjusteOperacionBimestre(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'cuotasIMSS' && modo === 'Ajuste' && tipo === 'Eventual' && (mes % 2) === 1) {
    return generateFileTxtAjusteEventual(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'cuotasIMSS' && modo === 'Ajuste' && tipo === 'Eventual' && (mes % 2) === 0) {
    return generateFileTxtAjusteEventualBimestre(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'pasivoLaboral') {
    return generateFileTxtPasivoLaboral(cuentasMayor, poliza, monthText, año, monthAndYear);
  }
  if (proceso === 'impNomina') {
    return generateFileTxtImpNomina(cuentasContables, cuentasMayor, poliza, monthText, año, monthAndYear);
  }
};
