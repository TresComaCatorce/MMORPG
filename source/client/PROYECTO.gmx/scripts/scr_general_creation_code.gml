///General Rooms Creation Code
//This is called in every room creation code.

//GUI
show_debug_message("GUI scale");
show_debug_message(string(display_get_gui_width()));
show_debug_message(string(view_wview[view_current]));
global.gui_scale = display_get_gui_width() / view_wview[view_current];
global.gui_scale_x = display_get_gui_width() / view_wview[view_current];
global.gui_scale_y = display_get_gui_height() / view_hview[view_current];
