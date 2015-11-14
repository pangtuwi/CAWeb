var sendMessage = function (){
	console.log ("Sending Message");
	cds_sendMessage($("#inputSurname").val(), $("#inputFirstName").val(), $("#inputName").val(), $("#inputEmail").val());
}; //saveUser


$("#buttonSendMessage").on('touchend' , sendMessage);
