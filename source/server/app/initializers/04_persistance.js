/*
    Project: MMORPGServer
    Date: 23/03/2020
	Author: Cristian Ferrero
	
	Responsable of persist client data in DB.

*/

const persistData = () => {
	maps.forEachRoom( room => {
		room.clients.forEach( client => {
			client.user.save();
		});
	});
}

module.exports = persistenceInterval = setInterval( persistData, Config.data_base.persist_interval );