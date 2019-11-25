/*
    Proyecto: MMORPGServer
    Fecha: 31/01/2019
    Autor: Cristian Ferrero
*/

//Require de la libreria JS mongoose.
var mongoose = require('mongoose');

//Configs
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

//Se conecta a la base de datos.
module.exports = gamedb = mongoose.createConnection( config.data_base.url );
