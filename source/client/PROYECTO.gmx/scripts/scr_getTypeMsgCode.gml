// Recibe el tipo de chat en string y retorna el código del tipo
// de mensaje entre

var typeMsgStringCode = argument0;

switch(typeMsgStringCode)
{
    case "CHAT":
    {
        return 0;
        break;
    }
    case "GLOBAL":
    {
        return 1
        break;
    }
    case "WHISPER":
    {
        return 2;
        break;
    }
}