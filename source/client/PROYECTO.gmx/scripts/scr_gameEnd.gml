/// scr_gameEnd()

if !os_is_network_connected()
{
    network_destroy(sock);
}

game_end();
