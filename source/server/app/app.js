/*
    Project: MMORPGServer
    Date: 24/01/2019
    Author: Cristian Ferrero

    Description: Starting point of the application.

*/

const Server = require('./classes/Server');

// Global reference to app path
global.appRoot = __dirname;

const App = new Server();