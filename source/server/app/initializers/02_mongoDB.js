/*
    Project: MMORPGServer
    Date: 31/01/2019
    Author: Cristian Ferrero
*/

//Require de la libreria JS mongoose.
var mongoose = require('mongoose');

//Configs
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

//Se conecta a la base de datos.
module.exports = gamedb = mongoose.createConnection( Config.data_base.url );
