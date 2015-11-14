var clubName = cds_getCookieClubName();
console.log ("Retrieved clubName Cookie: "+clubName);
if (clubName != "") $("#inputClubName").val(clubName);

var email = cds_getCookie("email");
console.log ("Retrieved email Cookie: "+email);
if (email != "") $("#inputEmail").val(email);

var password = cds_getCookie("password");
console.log ("Retrieved password Cookie: "+password);
if (password != "") $("#inputPassword").val(password);


$("#button_login").click(function() {
	FirebaseEmail = $("#inputEmail").val();
	console.log ("Email is: ")+FirebaseEmail;
	FirebaseClubName = $("#inputClubName").val();
	console.log ("Club is: ")+FirebaseClubName;
	FirebasePassword = $("#inputPassword").val();
	console.log ("Password is: ")+FirebasePassword;
	cds_setCookies (FirebaseClubName, FirebaseEmail, FirebasePassword, 365);
	cds_Authenticate();
	if (FirebaseConnected){
	  	console.log ("Exiting login...");
	  		PUSH ({url: '../caweb.html', transition: 'slide-out'})
	  } else {
	  	console.log ("not connected - perhaps wrong Auth Params");
	  };
});