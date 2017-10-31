// переменная драйвера
var ECR;

// создаем объект драйвера
ECR = new ActiveXObject ("AddIn.FPrnM45");

// Открыть визуальную страницу свойств драйвера
  ECR.ShowProperties ();  

  // занимаем порт
  ECR.DeviceEnabled = 1;

  if (ECR.GetStatus() != 0)
// далее везде вместо обработки ошибки просто отключаемся от ККМ...
    ECR.DeviceEnabled = 0;

  // проверяем на всякий случай ККМ на фискализированность
  if (ECR.Fiscal != 0)
    ECR.DeviceEnabled = 0;

  // если есть открытый чек, то отменяем его
  if (ECR.CheckState != 0)
    if (ECR.CancelCheck() != 0)
      ECR.DeviceEnabled = 0;

// если смена открыта снимаем Z-отчет
  if (ECR.SessionOpened != 0)
  {
    // устанавливаем пароль системного администратора ККМ
    ECR.Password = "30";
    // входим в режим отчетов с гашением
    ECR.Mode = 3;
    if (ECR.SetMode () == 0)
    { // снимаем отчет
      ECR.ReportType = 1;
      if (ECR.Report() != 0)
        ECR.DeviceEnabled = 0;
    }
  }
// входим в режим регистрации
  // устанавливаем пароль кассира
  ECR.Password = "1";
  // входим в режим регистрации
  ECR.Mode = 1;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;

// продажа без сдачи
  // регистрация продажи
  ECR.Name = "Молоко";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  ECR.Department = 2;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // скидка суммой на предыдущую позицию
  ECR.Percents = 10;
  ECR.Destination = 1;
  if (ECR.PercentsDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // регистрация продажи
  ECR.Name = "Фанта";
  ECR.Price = 25;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // скидка суммой на весь чек
  ECR.Summ = 10.40;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // закрытие чека наличными без ввода полученной от клиента суммы
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// продажа со сдачей
  // регистрация продажи
  ECR.Name = "Молоко";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  ECR.Department = 2;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // регистрация продажи
  ECR.Name = "Пепси-кола";
  ECR.Price = 25.00;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // сторно предыдущей регистрации
  if (ECR.Storno() != 0)
    ECR.DeviceEnabled = 0;
  // регистрация продажи
  ECR.Name = "Фанта";
  ECR.Price = 25;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // скидка суммой на весь чек
  ECR.Summ = 50;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // закрытие чека наличными с вводом полученной от клиента суммы
  ECR.Summ = 100;
  ECR.TypeClose = 0;
  if (ECR.Delivery() != 0)
    ECR.DeviceEnabled = 0;

// аннулирование
  // регистрация аннулирования
  ECR.Name = "Dirol";
  ECR.Price = 7;
  ECR.Quantity = 1;
  if (ECR.Annulate() != 0)
    ECR.DeviceEnabled = 0;
  // регистрация аннулирования
  ECR.Name = "Orbit";
  ECR.Price = 8;
  ECR.Quantity = 2;
  if (ECR.Annulate() != 0)
    ECR.DeviceEnabled = 0;
  // закрытие чека
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// возврат
  // регистрация возврата
  ECR.Name = "Молоко";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  if (ECR.Return() != 0)
    ECR.DeviceEnabled = 0;
  // регистрация возврата
  ECR.Name = "Колбаса";
  ECR.Price = 99.99;
  ECR.Quantity = 1.235;
  if (ECR.Return() != 0)
    ECR.DeviceEnabled = 0;
  // скидка суммой на весь чек
  ECR.Summ = 50;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // закрытие чека
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// внесение наличности
  ECR.Summ = 400.50;
  if (ECR.CashIncome() != 0)
    ECR.DeviceEnabled = 0;

// выплата наличности
  ECR.Summ = 121.34;
  if (ECR.CashOutcome() != 0)
    ECR.DeviceEnabled = 0;

// X - отчет
  // устанавливаем пароль администратора ККМ
  ECR.Password = "29";
  // входим в режим отчетов без гашения
  ECR.Mode = 2;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;
  // снимаем отчет
  ECR.ReportType = 2;
  if (ECR.Report() != 0)
    ECR.DeviceEnabled = 0;

// Z - отчет
  // устанавливаем пароль системного администратора ККМ
  ECR.Password = "30";
  // входим в режим отчетов с гашением
  ECR.Mode = 3;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;
  // снимаем отчет
  ECR.ReportType = 1;
  if (ECR.Report() != 0)
    ECR.DeviceEnabled = 0;

// выходим в режим выбора, чтобы кто-то под введенными паролями не сделал что нибуть нехорошее
  if (ECR.ResetMode() != 0)
    ECR.DeviceEnabled = 0;

// освобождаем порт
ECR.DeviceEnabled = 0;