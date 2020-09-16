/*
    Project: MMORPGServer
    Date: 23/03/2020
	Author: Cristian Ferrero
	
	Responsable of persist client data in DB.

*/

const persistData = () => {
	World.forEachRoom( room => {
		room.characters.forEach( character => {
			character.save();
		});
	});
}

module.exports = persistenceInterval = setInterval( persistData, Config.dataBase.persist_interval );