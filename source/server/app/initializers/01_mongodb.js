/*
    Proyecto: MMORPGServer
    Fecha: 31/01/2018
    Autor: Cristian Ferrero
*/

//Require de la libreria JS mongoose.
var mongoose = require('mongoose');

//Me conecto al a base de datos especificada en 'config.js'.
module.exports = gamedb = mongoose.createConnection( config.database );
