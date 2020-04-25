/*
    Project: MMORPGServer
    Date: 27/03/2020
    Author: Cristian Ferrero
*/

module.exports = Constants = {
	CHAT: {
		CHAT_MSG_TYPES: {
			CHAT: 0,
			GLOBAL: 1,
			WHISPER: 2
		}
	},
	PACKETS: {
		C_CHAT_MSG: 'C_CHAT_MSG',
		C_CON_CHECK: 'C_CON_CHECK',
		C_LOGIN: 'C_LOGIN',
		C_REGISTER: 'C_REGISTER',
		C_UPDATE: 'C_UPDATE',
		S_CHAT_MSG: 'S_CHAT_MSG',
		S_CON_CHECK: 'S_CON_CHECK',
		S_LOGIN: 'S_LOGIN',
		S_REGISTER: 'S_REGISTER',
		S_UPDATE: 'S_UPDATE',
		S_UPDATE_SPREAD: 'S_UPDATE_SPREAD',
		S_HELLO: 'S_HELLO',
		S_CLOSE_GAME: 'S_CLOSE_GAME',
		S_CHARACTER_CONNECT: 'S_CHARACTER_CONNECT'
	},
	ROOMS: {
		SELECT_CHARACTER: 'rm_select_character'
	},
	RACES: {
		WARRIOR: 0,
		MAGICIAN: 1,
		ELF: 3
	}
};