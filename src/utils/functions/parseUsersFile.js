const fs = require('fs');
const Boom = require('@hapi/boom');

function parseCSV(data) {
  const rows = data.split('\n');
  const headers = rows[0].split(',').map((item) => item.trimStart());
  const users = [];
  for (let i = 1; i < rows.length; i += 1) {
    const cells = rows[i].split(',').map((item) => item.trimStart());
    const user = {
      name: {},
      address: {},
    };
    headers.forEach((item, index) => {
      switch (headers[index]) {
        case 'nombre':
          user.name.first = cells[index];
          break;
        case 'apellido':
          user.name.last = cells[index];
          break;
        case 'tipo de documento':
          user.documenType = cells[index];
          break;
        case 'documento':
          user.document = cells[index];
          break;
        case 'rol':
          user.role = cells[index];
          break;
        case 'correo':
          user.email = cells[index];
          break;
        case 'fecha de nacimiento':
          user.birthdate = cells[index];
          break;
        case 'sexo':
          user.sex = cells[index];
          break;
        case 'calle':
          user.address.street = cells[index];
          break;
        case 'ciudad':
          user.address.city = cells[index];
          break;
        case 'país':
        case 'pais':
          user.address.state = cells[index];
          break;
        case 'código postal':
        case 'codigo postal':
          user.address.zip = cells[index];
          break;
        case 'teléfono':
        case 'telefono':
          user.phone = cells[index];
          break;
        default:
          throw Boom.badRequest('Incorrect headers');
      }
    });
    users.push(user);
  }
  return users;
}

function parseExcel(file) {
  console.log('Parsing Excel');
}

async function parseUsersFile(file) {
  const data = await fs.promises.readFile(file.path, { encoding: 'utf-8' });
  let users;
  if (data.includes('[Content_Types]')) {
    parseExcel(file);
  } else {
    users = parseCSV(data);
  }
  return users;
}

module.exports = parseUsersFile;
