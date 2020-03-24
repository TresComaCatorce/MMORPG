/*
    Proyecto: MMORPGServer
    Fecha: 23/03/2020
	Autor: Cristian Ferrero
	
	Responsable of persist client data in DB.

*/

const persistData = () => {
	maps.forEachRoom( room => {
		room.clients.forEach( client => {
			client.user.save();
		});
	});
}

module.exports = persistenceInterval = setInterval( persistData, config.data_base.persist_interval );