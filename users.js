var newID;
var newUser = false;

var addUser = function(){
	newID = uuid();
	$("#ID").html (newID);
	console.log ("New User ID Created : " +newID);
	newUser = true;
};

var saveUser = function (){
	console.log ("Saving user data");
	console.log (newID);
	if (newUser == true) {
		cds_createUser ($("#inputEmail").val());
		console.log ("created new user with Email = "+ $("#inputEmail").val());
	}
	cds_saveUser (newID, $("#inputSurname").val(), $("#inputFirstName").val(), $("#inputName").val(), $("#inputEmail").val());
}; //saveUser

$('#editUserModal').on('modalOpen', addUser);
//$('#editUserModal').on('modalClose', saveUser);
$("#buttonSaveUser").on('touchend' , saveUser);
