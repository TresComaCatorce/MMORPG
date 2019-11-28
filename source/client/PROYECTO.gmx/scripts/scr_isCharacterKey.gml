
var keyToEvaluate = argument0;

if( keyToEvaluate != vk_left &&
    keyToEvaluate != vk_right &&
    keyToEvaluate != vk_up &&
    keyToEvaluate != vk_down &&
    keyToEvaluate != vk_escape &&
    keyToEvaluate != vk_shift &&
    keyToEvaluate != vk_control &&
    keyToEvaluate != vk_alt &&
    keyToEvaluate != vk_backspace &&
    keyToEvaluate != vk_tab &&
    keyToEvaluate != vk_home &&
    keyToEvaluate != vk_end &&
    keyToEvaluate != vk_delete &&
    keyToEvaluate != vk_insert &&
    keyToEvaluate != vk_pageup &&
    keyToEvaluate != vk_pagedown &&
    keyToEvaluate != vk_pause &&
    keyToEvaluate != vk_printscreen &&
    keyToEvaluate != vk_f1 &&
    keyToEvaluate != vk_f2 &&
    keyToEvaluate != vk_f3 &&
    keyToEvaluate != vk_f4 &&
    keyToEvaluate != vk_f5 &&
    keyToEvaluate != vk_f6 &&
    keyToEvaluate != vk_f7 &&
    keyToEvaluate != vk_f8 &&
    keyToEvaluate != vk_f9 &&
    keyToEvaluate != vk_f10 &&
    keyToEvaluate != vk_f11 &&
    keyToEvaluate != vk_f12 &&
    keyToEvaluate != 20 &&  //Block Mayus Key
    keyToEvaluate != 91 &&  //Windows Key
    keyToEvaluate != 93 &&  //Options Key
    keyToEvaluate != 144 && //Block Num Key
    keyToEvaluate != 145 && //Scroll Lock Key
    keyToEvaluate != 162 && //Left Control
    keyToEvaluate != 163 && //Right Control
    keyToEvaluate != 164 && //Left Alt
    keyToEvaluate != 145    //Right Alt
    )
{
    return true;
}
else
{
    return false;
}
