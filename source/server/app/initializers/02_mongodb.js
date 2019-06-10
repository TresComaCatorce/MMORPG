/*
    Proyecto: MMORPGServer
    Fecha: 31/01/2018
    Autor: Cristian Ferrero
*/

//Require de la libreria JS mongoose.
var mongoose = require('mongoose');

//Se conecta a la base de datos.
module.exports = gamedb = mongoose.createConnection( config.data_base.url );
