/*
    Proyecto: MMORPGServer
    Fecha: 18/03/2020
    Autor: Cristian Ferrero

	Descripcion: Handler que maneja la recepción del paquete "C_UPDATE" enviado por el cliente.
	Este paquete contiene un update del cliente.

*/

module.exports = packet_C_UPDATE = {
	process: ( cliente, datapacket ) => {
		// Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
		var data = PacketModels.position_update.parse(datapacket);
		
		//TODO Checkear que las nuevas coordenadas no sean incoherentes.
		
		// Se actualizan los valores de la posicion del objeto personaje
		// con los valores recibidos. X e Y.
		cliente.user.pos_x = data.new_x;
		cliente.user.pos_y = data.new_y;
		
		// Se guardan los datos en la base de datos.
		cliente.user.save();
		
		// Se le comunica al cliente que debe actualizar en su cliente
		// el dato actualizado por otro cliente.
		cliente.broadcastRoom( cliente.user.username, data.new_x, data.new_y, data.direction, data.state );
	}
}