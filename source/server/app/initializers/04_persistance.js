/*
    Proyecto: MMORPGServer
    Fecha: 23/03/2020
    Autor: Cristian Ferrero
*/

const persistData = () => {
	maps.forEachRoom( room => {
		room.clients.forEach( client => {
			client.user.save();
		});
	});
}

module.exports = persistenceInterval = setInterval( persistData, config.data_base.persist_interval );