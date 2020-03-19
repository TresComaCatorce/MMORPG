/*
    Proyecto: MMORPGServer
    Fecha: 18/03/2020
    Autor: Cristian Ferrero

	Descripcion: Handler que maneja la recepción del paquete "C_REGISTER" enviado por el cliente.
	Este paquete contiene una solicitud de registro de una cuenta nueva.
	
*/

module.exports = packet_C_REGISTER = {
	process: (cliente, datapacket) => {
		var data = PacketModels.register.parse(datapacket);
		User.register( data.username, data.password, function(result)
		{
			if(result)
			{
				cliente.socket.write( packet.build( ["S_REGISTER", "TRUE"] ) );
			}
			else
			{
				cliente.socket.write( packet.build( ["S_REGISTER", "FALSE"] ) );
			}
		});
	}
}