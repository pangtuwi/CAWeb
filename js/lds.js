function lds_saveAuthInfo (new_clubname, new_email, new_password) {
    // to store an object locally : window.localStorage.setItem ("myObject", JSON.stringify({foo: "bar"}));
    // to retrieve : JSON.parse(window.localStorage.getItem("myObject"));
    var authObj = {clubname : new_clubname,
                    email : new_email,
                    password : new_password};
    window.localStorage.setItem ("caweb_authinfo", JSON.stringify(authObj));
    console.log(JSON.stringify(authObj));
}//lds_saveAuthInfo


function lds_loadAuthInfo () {
    var authObj = JSON.parse (window.localStorage.getItem("caweb_authinfo"));
    console.log (window.localStorage.getItem("caweb_authinfo"));
    console.log (authObj);
    return authObj;
}//lds_loadAuthInfo


//--Username Cookies --//

//var cookiePrefix = "clarch";


/*function old_setCookies(clubName, email, password, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cookiePrefix+"clubname" + "=" + clubName + "; " + expires;
    document.cookie = cookiePrefix+"email" + "=" + email + "; " + expires;
    document.cookie = cookiePrefix+"password" + "=" + password + "; " + expires;
    console.log ("cookies set: "+clubName, + " "+ email + " "+ password);

}



function old_getCookieClubName() {
    var name = cookiePrefix+"clubname" + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0)  return c.substring(name.length, c.length);
    }
    return "";
}

function old_getCookie(cookieName) {
  if ((cookieName == "clubname") || (cookieName == "email") || (cookieName == "password")) {
    var name = cookiePrefix+cookieName + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0)  {
          console.log ("found Cookie for " + cookieName + " with " + c.substring(name.length, c.length));
          return c.substring(name.length, c.length);
        }
    }
  }
  return "";
}
*/