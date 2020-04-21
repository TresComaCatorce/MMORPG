/*
    Project: MMORPGServer
    Date: 18/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete "C_LOGIN" enviado por el cliente.
	Este paquete contiene una solicitud de login con una cuenta.

*/

module.exports = packet_C_LOGIN = {

	process: async ( client, datapacket ) => {
		
		// Read incoming data, packet model defined in <01_packetmodels.js>.
		const data = PacketModels.login.parse( datapacket );
		
		// Determined if was received an email or nickname 
		const dataToLogin = {};
		if( Utils.isEmail(data.input) ) {
			dataToLogin.email = data.input;
		}
		else {
			dataToLogin.nickname = data.input;
		}

		dataToLogin.password = data.password;

		try {
			const accountData = await AccountModel.login( dataToLogin );
			client.loginAccount(accountData);
		} catch (error) {
			console.log( `C_LOGIN ERROR: ${error}` );
			client.loginFail(error);
		}
	}
};
