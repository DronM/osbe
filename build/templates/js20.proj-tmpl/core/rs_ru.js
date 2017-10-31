ServConnector.prototype.ER_STATUS0 = "Попытка соединения не удалась";

Model.prototype.ER_NO_MODEL = "Модель % не найдена.";
Model.prototype.ER_NO_FIELD = "Поле % модели % не найдено.";
Model.prototype.ER_NO_FIELDS = "Поля модели % не определены.";
Model.prototype.ER_LOCKED = "Модель заблокирована.";
Model.prototype.ER_REС_NOT_FOUND = "Запись не найдена.";

Validator.prototype.ER_EMPTY = "пустое значение";
Validator.prototype.ER_TOO_LONG = "значение слишком длинное";
Validator.prototype.ER_TOO_SHORT = "значение слишком короткое";
Validator.prototype.ER_INVALID = "неверное значение.";

ValidatorBool.prototype.TRUE_VALS = ["да","д","истина"];

ValidatorInt.prototype.ER_VIOL_NOT_ZERO = "значение равно нулю";
ValidatorInt.prototype.ER_VIOL_MAX = "значение больше %";
ValidatorInt.prototype.ER_VIOL_MIN = "значение меньше %";
ValidatorInt.prototype.ER_VIOL_UNSIGNED = "значение меньше нуля";

//ValidatorFloat.prototype.DECIMAL_SEP = ".";

Field.prototype.ER_NO_VALIDATOR = "Поле:%, не задан валидатор.";

//FieldRef.prototype.ER_NO_KEY = "ключевое поле не найдено.";


DateHelper.MON_LIST = Array("Января","Февраля","Марта","Апреля","Мая",
	"Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря");
DateHelper.FORMAT_STR = "d/m/Y H:i:s";

EventHelper.DEL_ERR = "Невозможно удалить событие.";

Response.prototype.ERR_NO_MODEL = "Модель % не найдена.";

PublicMethod.prototype.ER_NO_FIELD = "Контроллер %, метод %, поле % не найдено.";
PublicMethod.prototype.ER_NO_CONTROLLER = "Метод %, не задан контроллер.";

Controller.prototype.ER_NO_METHOD = "Метод % контроллера % не найден.";
Controller.prototype.ER_EMPTY = "Контроллер %, метод %, поле %, не задано обязательное значение.";

ControllerObjClient.prototype.ER_UNSUPPORTED_CLIENT_MODEL = "Не поддерживоемый тип клиентской модели.";

ModelFilter.prototype.ER_NO_CTRL = "Фильтр %, не указан контрол.";
ModelFilter.prototype.ER_INVALID_CTRL = "Есть неправильные значения в фильтре.";

