/// scr_packetHandlerCharacterConnect( dataFromServer)

scr_destroyAllInstances(obj_characterPreview);

var name = buffer_read(argument0, buffer_string);
var level = buffer_read(argument0, buffer_u16);
var race = buffer_read(argument0, buffer_u16);
var current_room_code = buffer_read(argument0, buffer_u16);
var current_room_name = scr_getRoomName( current_room_code );
var pos_x = buffer_read(argument0, buffer_u16);
var pos_y = buffer_read(argument0, buffer_u16);
var currentHp = buffer_read(argument0, buffer_u16);
var maxHp = buffer_read(argument0, buffer_u16);
var currentMana = buffer_read(argument0, buffer_u16);
var maxMana = buffer_read(argument0, buffer_u16);
var currentExp = buffer_read(argument0, buffer_u16);
var nextLevelExp = buffer_read(argument0, buffer_u16);

show_debug_message("CBF: " + string(name) + " | " + string(level) + " | " + string(race) + " | ");

global.playerOnline = instance_create( -1000, -1000, obj_character);

global.playerOnline.name = name;
global.playerOnline.race = race;
global.playerOnline.level = level;
global.playerOnline.x = pos_x;
global.playerOnline.y = pos_y;
global.playerOnline.currentHp = currentHp;
global.playerOnline.maxHp = maxHp;
global.playerOnline.currentMana = currentMana;
global.playerOnline.maxMana = maxMana;
global.playerOnline.currentExp = currentExp;
global.playerOnline.nextLevelExp = nextLevelExp;


room_goto( asset_get_index(current_room_name) );
