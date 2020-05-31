const XLSX = require('xlsx');
const Boom = require('@hapi/boom');

function parseUser(headers, info) {
  const user = {
    name: {},
    address: {},
  };
  headers.forEach((item, index) => {
    switch (item) {
      case 'nombre':
        user.name.first = info[index];
        break;
      case 'apellido':
        user.name.last = info[index];
        break;
      case 'tipo de documento':
        user.documenType = info[index];
        break;
      case 'documento':
        user.document = info[index];
        break;
      case 'rol':
        user.role = info[index];
        break;
      case 'correo':
        user.email = info[index];
        break;
      case 'fecha de nacimiento':
        user.birthdate = info[index];
        break;
      case 'sexo':
        user.sex = info[index];
        break;
      case 'calle':
        user.address.street = info[index];
        break;
      case 'ciudad':
        user.address.city = info[index];
        break;
      case 'país':
      case 'pais':
        user.address.state = info[index];
        break;
      case 'código postal':
      case 'codigo postal':
        user.address.zip = info[index];
        break;
      case 'teléfono':
      case 'telefono':
        user.phone = info[index];
        break;
      default:
        console.log('Incorrect headers');
        throw Boom.badRequest('Incorrect headers');
    }
  });
  return user;
}

function readCSV(data) {
  const rows = data.split('\n');
  const headers = rows[0].split(',').map((item) => item.trimStart());
  const users = [];
  for (let i = 1; i < rows.length; i += 1) {
    const cells = rows[i].split(',').map((item) => item.trimStart());
    users.push(parseUser(headers, cells));
  }
  return users;
}

function readExcel(file) {
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const workbook = XLSX.read(file);
  let sheet;
  if (workbook.Sheets.Hoja1) {
    sheet = 'Hoja1';
  } else if (workbook.Sheets.Sheet1) {
    sheet = 'Sheet1';
  }
  const data = workbook.Sheets[sheet];
  const amountRows = data['!ref'].substring(4);
  const headers = columns.map((item) => data[`${item}1`].v.trimStart());
  const users = [];
  for (let i = 2; i <= amountRows; i += 1) {
    const cells = columns.map((item) => data[`${item}${i}`].w);
    users.push(parseUser(headers, cells));
  }
  return users;
}

function readFile(file) {
  const data = file.buffer.toString();
  let users;
  if (data.includes('[Content_Types]')) {
    users = readExcel(file.buffer);
  } else {
    users = readCSV(data);
  }
  return users;
}

module.exports = readFile;
