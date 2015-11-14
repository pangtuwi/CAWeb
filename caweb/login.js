var authParamObj = lds_loadAuthInfo();
if (authParamObj != null) {
	$(".inputClubName").val(authParamObj["clubname"]);
	$(".inputEmail").val(authParamObj["email"]);
	$(".inputPassword").val(authParamObj["password"]);
}


$(".js-btn-login").on("touchend",function() {
	console.log ("---LOGIN BUTTON CLICKED---");
	FirebaseEmail = $(".inputEmail").val();
	console.log ("Email is: ")+FirebaseEmail;
	FirebaseClubName = $(".inputClubName").val();
	console.log ("Club is: ")+FirebaseClubName;
	FirebasePassword = $(".inputPassword").val();
	console.log ("Password is: ")+FirebasePassword;
	lds_saveAuthInfo(FirebaseClubName, FirebaseEmail, FirebasePassword);
	cds_Authenticate();
	if (FirebaseConnected){
	  	console.log ("Exiting login...");
	  		PUSH ({url: '../caweb.html', transition: 'slide-out'})
	  } else {
	  	console.log ("not connected - perhaps wrong Auth Params");
	  };
});