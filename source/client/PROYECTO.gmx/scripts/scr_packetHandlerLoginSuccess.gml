///scr_packetHandlerLoginSuccess( dataFromServer );

// Parse data from server
email = buffer_read(argument0, buffer_string);
nickname = buffer_read(argument0, buffer_string);
creation_date = buffer_read(argument0, buffer_string);
last_login_date = buffer_read(argument0, buffer_string);

characters_created = buffer_read(argument0, buffer_u16);

// Get all characters of the account.
global.accountCharacters = ds_list_create();
if( characters_created>0 ) {
    for( var i = characters_created ; i>0 ; --i ) {
        var character_name = buffer_read(argument0, buffer_string);
        var character_race = buffer_read(argument0, buffer_u16);
        var character_level = buffer_read(argument0, buffer_u16);
        var character_account_slot = buffer_read(argument0, buffer_u16);
        var character = instance_create( -1000, -1000, obj_characterPreview );
        
        character.name = character_name;
        character.race = character_race;
        character.level = character_level;
        character.slotNumber = character_account_slot;
        
        ds_list_add( global.accountCharacters, character );
    }
}

// Move to the "Character selection" room.
room_goto(rom_character_selection);
