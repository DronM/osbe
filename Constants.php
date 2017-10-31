<?php
//data types
define("DT_INT", 0);
define("DT_INT_UNSIGNED", 1);
define("DT_STRING", 2);
define("DT_FLOAT_UNSIGNED", 3);
define("DT_FLOAT", 4);
define("DT_CUR_RUR", 5);
define("DT_CUR_USD", 6);
define("DT_BOOL", 7);
define("DT_TEXT", 8);
define("DT_DATETIME", 9);
define("DT_DATE", 10);
define("DT_TIME", 11);
define("DT_OBJECT", 12);
define("DT_FILE", 13);
define("DT_PWD", 14);
define("DT_EMAIL", 15);
define("DT_ENUM", 16);

define("DT_GEOM_POLYGON", 17);
define("DT_GEOM_POINT", 18);

define("DT_INTERVAL", 19);
define("DT_DATETIMETZ", 20);
define("DT_JSON", 21);
define("DT_JSONB", 22);
define("DT_ARRAY", 23);
define("DT_XML", 24);
define("DT_INT_BIG", 25);
define("DT_INT_SMALL", 26);

//Field types
define("FT_DATA", 0);
define("FT_LOOK_UP", 1);
define("FT_CALC", 2);

define("COND_SIGN_KEYS", "e,l,g,le,ge,lk,ne,i,in,incl,any,overlap");
define("COND_SIGNS", "=,<,>,<=,>=,LIKE,<>,IS,IS NOT,IN,=ANY,&&");

define('XSLT_STYLE_PATH', 'xslt_styles/');
define('XSLT_DEF_STYLE', 'common');

//edit modes depricated
define('EM_SELECT', 0);
define('EM_WINDOW', 1);

define('FORM_TEMPL_PATH', 'forms/');
define('FORM_EXT', 'form');

//Browse methods depricated
define('BROWSE_MODE_VIEW', 0);
define('BROWSE_MODE_EDIT', 1);
define('BROWSE_MODE_INSERT', 2);

//Errors
define('ERR_AUTH', 'Ошибка авторизации.@100');
define('ERR_AUTH_EXP', 'Срок сессии истек.@101');
define('ERR_AUTH_NOT_LOGGED', 'Не авторизован.@102');

define('ERR_COM_NO_CONTROLLER', "Контроллер не определен.@10");
define('ERR_COM_METH_PROHIB', 'Метод запрещен.@11');
define('ERR_COM_NO_VIEW', 'Вид не определен.@12');

//DB
define('ERR_DELETE_CONSTR_VIOL', 'Удаление невозможно, так как существуют ссылки.@500');

define('FW_VERSION', '2.1.12');
?>
