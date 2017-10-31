/* интерфейс для работы с кассой*/
function CashRegister(options){
	options = options || {};
	
	this.m_app = options.app;
	
	try{
		this.ECR = new ActiveXObject(this.DEF_XOBJ);
		this.ECR.DeviceEnabled = 1;
	}
	catch(e){
		window.showError("Ошибка инициализации ККМ: "+e.message);
	}
}

CashRegister.prototype.m_app;
CashRegister.prototype.DEF_XOBJ = "AddIn.FPrnM45";

CashRegister.prototype.showProperties = function(){
	this.ECR.ShowProperties();  
}
CashRegister.prototype.getEnabled = function(){
	if (this.ECR){
		return this.ECR.DeviceEnabled;  
	}
}

/**
 * @param {namespace} params
 		pwd
		items
		total
		total_cash
		total_bank
		bank_pay_types

 */
CashRegister.prototype.printCheck = function(params){
	this.ECR.Password = params.pwd;
	
	// входим в режим регистрации
	this.ECR.Mode = 1;
	if (this.ECR.SetMode() != 0){
		throw new Error("Ошибка ККМ: не верный режим работы!");
	}
	//регистрация товаров
	for (var i=0;i<params.items.length;i++){
		this.ECR.Name		= params.items[i].name;
		this.ECR.Price		= parseFloat(params.items[i].price);
		this.ECR.Quantity	= parseFloat(params.items[i].quantity);
		this.ECR.Department	= (params.items[i].department)? params.items[i].department:1;
		
		if (this.ECR.Registration() != 0){
			throw new Error("Ошибка при регистрации товара");
		}		
	}
	
	// закрытие чека наличными с вводом полученной от клиента суммы
	this.ECR.Summ = parseFloat(params.total);
	this.ECR.TypeClose = parseInt(params.typeClose);
	
	if (this.ECR.Delivery() != 0){
		throw new Error("Ошибка при закрытии чека ");
	}
}

/* X - отчет
params
	pwd=29
*/
CashRegister.prototype.printX = function(params){
	// устанавливаем пароль системного администратора ККМ
	this.ECR.Password = params.pwd;
	// входим в режим отчетов с гашением
	this.ECR.Mode = 2;
	if (this.ECR.SetMode() != 0){
		throw new Error("Ошибка");
	}
	// снимаем отчет
	this.ECR.ReportType = 2;
	if (this.ECR.Report() != 0){
		throw new Error("Ошибка");
	}
}

/* Z - отчет
params
	pwd=30
*/
CashRegister.prototype.printZ = function(params){
	// устанавливаем пароль системного администратора ККМ
	this.ECR.Password = params.pwd;
	// входим в режим отчетов с гашением
	this.ECR.Mode = 3;
	if (this.ECR.SetMode() != 0){
		throw new Error("Ошибка");
	}
	// снимаем отчет
	this.ECR.ReportType = 1;
	if (this.ECR.Report() != 0){
		throw new Error("Ошибка");
	}
}
