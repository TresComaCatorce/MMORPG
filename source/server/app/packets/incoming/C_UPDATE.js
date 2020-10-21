/*
    Project: MMORPGServer
    Date: 18/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete "C_UPDATE" enviado por el cliente.
	Este paquete contiene un update del cliente.

*/

module.exports = packet_C_UPDATE = {
	process: ( client, datapacket ) => {
		// Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
		var data = PacketModels.character_update.parse(datapacket);
		
		//TODO Checkear que las nuevas coordenadas no sean incoherentes.
		
		// Se actualizan los valores de la posicion del objeto personaje
		// con los valores recibidos. X e Y.
		client.getAccount().getCharacterOnline().getPosition().setNewPosition({
			x: data.new_x,
			y: data.new_y
		});
		
		
		// Se le comunica al cliente que debe actualizar en su cliente el dato actualizado por otro cliente.
		client.getAccount().getCharacterOnline().broadcastNearby( [
			Constants.PACKETS.S_UPDATE_SPREAD,
			client.getAccount().getCharacterOnline().getName(),
			data.new_x,
			data.new_y,
			data.direction,
			data.state],
		false );
	}
}