// ���������� ��������
var ECR;

// ������� ������ ��������
ECR = new ActiveXObject ("AddIn.FPrnM45");

// ������� ���������� �������� ������� ��������
  ECR.ShowProperties ();  

  // �������� ����
  ECR.DeviceEnabled = 1;

  if (ECR.GetStatus() != 0)
// ����� ����� ������ ��������� ������ ������ ����������� �� ���...
    ECR.DeviceEnabled = 0;

  // ��������� �� ������ ������ ��� �� �������������������
  if (ECR.Fiscal != 0)
    ECR.DeviceEnabled = 0;

  // ���� ���� �������� ���, �� �������� ���
  if (ECR.CheckState != 0)
    if (ECR.CancelCheck() != 0)
      ECR.DeviceEnabled = 0;

// ���� ����� ������� ������� Z-�����
  if (ECR.SessionOpened != 0)
  {
    // ������������� ������ ���������� �������������� ���
    ECR.Password = "30";
    // ������ � ����� ������� � ��������
    ECR.Mode = 3;
    if (ECR.SetMode () == 0)
    { // ������� �����
      ECR.ReportType = 1;
      if (ECR.Report() != 0)
        ECR.DeviceEnabled = 0;
    }
  }
// ������ � ����� �����������
  // ������������� ������ �������
  ECR.Password = "1";
  // ������ � ����� �����������
  ECR.Mode = 1;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;

// ������� ��� �����
  // ����������� �������
  ECR.Name = "������";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  ECR.Department = 2;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // ������ ������ �� ���������� �������
  ECR.Percents = 10;
  ECR.Destination = 1;
  if (ECR.PercentsDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // ����������� �������
  ECR.Name = "�����";
  ECR.Price = 25;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // ������ ������ �� ���� ���
  ECR.Summ = 10.40;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // �������� ���� ��������� ��� ����� ���������� �� ������� �����
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// ������� �� ������
  // ����������� �������
  ECR.Name = "������";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  ECR.Department = 2;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // ����������� �������
  ECR.Name = "�����-����";
  ECR.Price = 25.00;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // ������ ���������� �����������
  if (ECR.Storno() != 0)
    ECR.DeviceEnabled = 0;
  // ����������� �������
  ECR.Name = "�����";
  ECR.Price = 25;
  ECR.Quantity = 5;
  ECR.Department = 1;
  if (ECR.Registration() != 0)
    ECR.DeviceEnabled = 0;
  // ������ ������ �� ���� ���
  ECR.Summ = 50;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // �������� ���� ��������� � ������ ���������� �� ������� �����
  ECR.Summ = 100;
  ECR.TypeClose = 0;
  if (ECR.Delivery() != 0)
    ECR.DeviceEnabled = 0;

// �������������
  // ����������� �������������
  ECR.Name = "Dirol";
  ECR.Price = 7;
  ECR.Quantity = 1;
  if (ECR.Annulate() != 0)
    ECR.DeviceEnabled = 0;
  // ����������� �������������
  ECR.Name = "Orbit";
  ECR.Price = 8;
  ECR.Quantity = 2;
  if (ECR.Annulate() != 0)
    ECR.DeviceEnabled = 0;
  // �������� ����
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// �������
  // ����������� ��������
  ECR.Name = "������";
  ECR.Price = 10.45;
  ECR.Quantity = 1;
  if (ECR.Return() != 0)
    ECR.DeviceEnabled = 0;
  // ����������� ��������
  ECR.Name = "�������";
  ECR.Price = 99.99;
  ECR.Quantity = 1.235;
  if (ECR.Return() != 0)
    ECR.DeviceEnabled = 0;
  // ������ ������ �� ���� ���
  ECR.Summ = 50;
  ECR.Destination = 0;
  if (ECR.SummDiscount() != 0)
    ECR.DeviceEnabled = 0;
  // �������� ����
  ECR.TypeClose = 0;
  if (ECR.CloseCheck() != 0)
    ECR.DeviceEnabled = 0;

// �������� ����������
  ECR.Summ = 400.50;
  if (ECR.CashIncome() != 0)
    ECR.DeviceEnabled = 0;

// ������� ����������
  ECR.Summ = 121.34;
  if (ECR.CashOutcome() != 0)
    ECR.DeviceEnabled = 0;

// X - �����
  // ������������� ������ �������������� ���
  ECR.Password = "29";
  // ������ � ����� ������� ��� �������
  ECR.Mode = 2;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;
  // ������� �����
  ECR.ReportType = 2;
  if (ECR.Report() != 0)
    ECR.DeviceEnabled = 0;

// Z - �����
  // ������������� ������ ���������� �������������� ���
  ECR.Password = "30";
  // ������ � ����� ������� � ��������
  ECR.Mode = 3;
  if (ECR.SetMode() != 0)
    ECR.DeviceEnabled = 0;
  // ������� �����
  ECR.ReportType = 1;
  if (ECR.Report() != 0)
    ECR.DeviceEnabled = 0;

// ������� � ����� ������, ����� ���-�� ��� ���������� �������� �� ������ ��� ������ ���������
  if (ECR.ResetMode() != 0)
    ECR.DeviceEnabled = 0;

// ����������� ����
ECR.DeviceEnabled = 0;