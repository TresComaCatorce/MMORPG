/// Create the characters slots

var horizontalPosition = view_wview[view_current]*.2;
var verticalPosition = view_hview[view_current]*.7;

// Create the "obj_characterSlot" instances
for( var i = 1; i<=5 ; i++ ) {
    var charSlotX = (horizontalPosition*i-(horizontalPosition/2));
    var charSlotY = verticalPosition;
    with( instance_create( charSlotX, charSlotY, obj_characterSlot ) ) {
        self.slotNumber = i;
        
        // Read the player received from server (in login packet handler)
        // If a characters has that slot, render that player to the position of the slot
        for( var j = 0 ; j<ds_list_size(global.accountCharacters); j++ ) {
            var char = ds_list_find_value( global.accountCharacters, j );
            if( self.slotNumber == char.slotNumber ) {
                self.character = char;
                char.x = self.x;
                char.y = self.y;
                self.empty = false;
            }
        }
    }
}

// Add the button "Create Character"
var createCharButtonPosX = view_wview[view_current] * .013;
var createCharButtonPosY = view_hview[view_current] * .9;
instance_create( createCharButtonPosX, createCharButtonPosY, btn_createCharacter );

// Add the button "Enter Game"
var enterGameButtonPosX = view_wview[view_current] * .987 - sprite_get_width(spr_enterGameButton);
var enterGameButtonPosY = view_hview[view_current] * .9;

instance_create( enterGameButtonPosX, enterGameButtonPosY, btn_enterGame );
