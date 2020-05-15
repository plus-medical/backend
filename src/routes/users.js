// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('../schema/db');
// const person = require('../schema/model/person');
// const user = require('../schema/model/user');

// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// module.exports = function (app) {
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept',
//     );
//     next();
//   });

// const router = express.Router();
// app.use('/v1/users', router);

// Mostrar todos los usuarios
// router.get('/', async (req, res, next) => {
//   res.send('Users');
// });

// router.get('/:id', async (req, res, next) => {
// Mostrar  el usuario con el :id
// });

// router.get('/:document', async (req, res, next) => {
// Mostrar  el usuario con el :document
// });

// Crear un nuevo usuario
// router.post('/', jsonParser, (req, res) => {
//   const data = req.body;
//   console.log(data);
// });

// router.patch('/:id', async (req, res, next) => {
// Actualiza un usuario con el :id
// });

// router.delete('/:id', async (req, res, next) => {
// Elimina un usuario con el :id
// });

//   app.get('/api/bike/find', (req, res) => {
//     bike.find(req.query, (err, done) => {
//       if (err) {
//         res.status = 400;
//         res.send(err);
//         return;
//       }
//       res.status = 202;
//       res.send(done);
//     });
//   });
// };
