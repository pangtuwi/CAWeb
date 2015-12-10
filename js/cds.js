var CAWebVersion = "0.3.2";
var FirebaseRef = new Firebase('https://cadev.firebaseio.com/');
var FirebaseConnectedRef = FirebaseRef.child('.info/connected');
var FirebaseRoundTypesRef = FirebaseRef.child('roundTypes/data/');
//var  FirebaseClubRefString = 'https://cadevclub.firebaseio.com';
var FirebaseClubRefString = "";
var FirebaseClubRef;
var usersRef;
var roundsRef;
var myRoundsRef;
var joinableRoundsRef;

var FirebaseClubName = "";
var FirebaseUserID = "";
var FirebaseEmail = "";
var FirebasePassword = "";
var FirebaseName = "";
var FirebaseHasAuthParams = false;
var FirebaseConnected = false;
var FirebaseAuthenticated = false;


var users = {};
var scoreArray = null;
var roundID;
var roundTypeID;
var roundTypeName = "Select Round Type";
var userID;
var totalScore = 0;
var totalArrows = 0;
var numArrowsPerEnd = 0;
var numEnds = 0;
var currentEnd = 0;
var currentArrow = 0;
var complete = false;
var currentRoundData = [];
var endTotal = 0;


//-- Login Functions --//

function cds_authHandler(error, authData) {
  if (error) {
    FirebaseAuthenticated = false;
    $(".onlyIfAuth").css('color', 'grey');
    // console.log("Login Failed!", error);
    $('#databaseConnection').html('Connected, Authentication Failed');
    $("#databaseConnection").css("color","red");
  } else {
    FirebaseAuthenticated = true;
    $(".onlyIfAuth").css('color', 'black');
    // console.log("Authenticated successfully with payload:", authData);
    $('#databaseConnection').html('Connected & Authenticated');
    $("#databaseConnection").css("color","green");

    usersRef.orderByChild('name').on('child_added', function(snapshot) {
      var myUser = snapshot.val();
      if (myUser.email == FirebaseEmail) {
        // console.log ("...found user match. FirebaseUserID = "+ myUser.id);
        FirebaseUserID = myUser.id;
        FirebaseName = myUser.name;
        //alert ("Welcome "+ FirebaseName);
        userID = FirebaseUserID;
        myRoundsRef = FirebaseClubRef.child("users/"+FirebaseUserID+"/rounds");
      }        
    });
  }
}


function cds_Authenticate () {
  // console.log ("Checking Authentication with Email: "+FirebaseEmail);
  FirebaseClubRef = new Firebase ('https://'+FirebaseClubName+'.firebaseio.com');
  usersRef = FirebaseClubRef.child('users');
  roundsRef = FirebaseClubRef.child('rounds');
  FirebaseClubRef.authWithPassword({
    email    : FirebaseEmail,
    password : FirebasePassword
  }, cds_authHandler);
  cds_checkAuthentication();
}; //cds_Authenticate


function cds_getAuthParams (){
  // console.log ("checking for existing auth parameters");
  var authParamObj = lds_loadAuthInfo();
  // console.log ("...auth params found : "+ authParamObj);
  if (authParamObj == null) {
    // console.log ("... no auth params saved, get new ones.");
    //PUSH ({url: 'caweb/login.html', transition: 'slide-in'});
    controller_login();
  } else {
    FirebaseClubName = authParamObj["clubname"];
    //// console.log ("Authparam[clubname]="+authParamObj["clubname"]);
    FirebaseEmail = authParamObj["email"];
    FirebasePassword = authParamObj["password"];


    //cds_checkAuthentication();
    if (FirebaseAuthenticated) {
      $(".onlyIfAuth").css('color', 'black');
      $('#databaseConnection').html('Connected & Authenticated');
    } else {
      cds_Authenticate();
    }
  }
}//cds_getAuthParams


function cds_checkAuthentication () {
  if (undefined != FirebaseClubRef) {
    // console.log ("Checking authentication on " + FirebaseClubRef);
    var authData = FirebaseClubRef.getAuth();
    if (authData) {
      FirebaseAuthenticated = true;
      $(".onlyIfAuth").css('color', 'black');
      // console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $('#databaseConnection').html('Connected & Authenticated');
      $("#databaseConnection").css("color","green");
    } else {
      FirebaseAuthenticated = false;
      $(".onlyIfAuth").css('color', 'grey');
      // console.log("User is logged out");
      $('#databaseConnection').html('Connected but NOT Authenticated');
      $("#databaseConnection").css("color","red");
    }
  }
}; //cds_checkAuthentication 



function cds_checkDatabaseConnection () {
  // console.log ("Checking databse connection");
  $('#databaseConnection').html('checking for connection');
  FirebaseConnectedRef.on("value", function(snap) {
    // console.log ("...got a snapshot from connectedRef : connected = " + snap.val());
    if (snap.val() === true) {
      //alert("connected");
      FirebaseConnected = true;
      FirebaseAuthenticated = false;
      $(".onlyIfAuth").css('color', 'grey');
      $('#databaseConnection').html('Database connected, authenticating...');
      $("#databaseConnection").css("color","green");
      cds_getAuthParams();
    } else {
      FirebaseConnected = false;
      FirebaseAuthenticated = false;
      $(".onlyIfAuth").css('color', 'grey');
      $('#databaseConnection').html('Database NOT connected');
      $("#databaseConnection").css("color","red");
      //alert("not connected");
    }
  });
};  //checkDatabaseConnection

// - - - - - - - - - - - - - - - Interface modifiers - - - - - - - - - - - - - //

function cds_writeUserModal (myUser){
  $("#ID").html(myUser.id);
  $("#inputSurname").val(myUser.surname);
  $("#inputFirstName").val(myUser.firstname);
  $("#inputName").val(myUser.name);
  $("#inputEmail").val(myUser.email);
}//cds_writeUserModal

function cds_getUsersList () {                
  usersRef.orderByChild('name').on('child_added', function(snapshot) {
    var myUser = snapshot.val();
    users [myUser.id] = myUser.name;
    
    $('#usersList').append ('<li class="table-view-cell">'+
                    '<a id="'+myUser.id+'" class="navigate-right" href="#editUserModal">'+
                    myUser.name+
                    '<p>'+myUser.email+'</p>' +
                    '</a></li>');
    $('#'+myUser.id).on('touchend', cds_writeUserModal(myUser));
            
  });
};  //getUsersList

function cds_getRoundsList () {   
  //// console.log("loading Rounds List");  
  $('#roundsList').html("");
  roundsRef.orderByChild('createdAt').on('child_added', function(snapshot) {
    var thisRound = snapshot.val(); 
    $('#roundsList').prepend ('<li class="table-view-cell">'+
                    '<a id="'+thisRound.id+'" class="navigate-right" href="#viewRoundScoresModal">'+
                    thisRound.roundType.name+
                    '<p>'+thisRound.creator.name+"  |   "+formattedDateTime (thisRound.createdAt)+'</p>' +
                    '</a></li>');  
  });
};  //getRoundsList

function cds_getRoundTypeList () {   

  // console.log("loading RoundType List");    
  $('#roundTypeUL').html("");         
  FirebaseRoundTypesRef.orderByChild('displayOrder').on('child_added', function(snapshot) {
    var thisRoundType = snapshot.val(); 
    if (thisRoundType.indoor) {isIndoor = "true"; } else {isIndoor = "false"};
    $('#roundTypeUL').append ('<li class="table-view-cell">'+
                    '<a id="'+thisRoundType.id+'"  href="#">'+
                    thisRoundType.name+
                    '<p>'+thisRoundType.description+'</p>' +
                    '</a></li>');  
    controller_addRoundTypeController (thisRoundType.id, thisRoundType.name);
  });
  // console.log ("...done");
};  //getRoundTypeList

function cds_getMyRoundsList () {   
  // console.log("loading MY Rounds List");
  myRoundsRef.off('child_added');
  $('#myRoundsList').html ("");
  myRoundsRef.orderByValue().on('child_added', function(snapshot) {
    var thisRoundListItem = snapshot.key();
    $('#myRoundsList').prepend ('<li id="round-'+thisRoundListItem+'" class="table-view-cell"></li>');
    thisRoundRef = roundsRef.child(thisRoundListItem);
    
    thisRoundRef.once('value', function(snapshot2) {
      var thisRound = snapshot2.val();
      $('#round-'+thisRound.id).html ('<a id="'+thisRound.id+'" class="roundListing" class="navigate-right" href="#">'+
                    thisRound.roundType.name+
                    '<p>'+thisRound.creator.name+"  |   "+formattedDateTime (thisRound.createdAt)+'</p>' +
                    '</a>');
      controller_addRoundController (thisRound.id);

    });
  });
};  //cds_getMyRoundsList

function cds_getJoinableRoundsList () {   
  // console.log("loading JOINABLE Rounds List");
$('#joinableRoundsList').html ("");
  roundsRef.orderByChild('createdAt').on('child_added', function(snapshot) {
    var thisRound = snapshot.val();

    if (thisRound.scores.users[userID] === undefined) {
      // console.log (" Found not joined round " + thisRound.id);
      $('#joinableRoundsList').prepend ('<li class="table-view-cell">'+
                    '<a id="'+thisRound.id+'" class="navigate-right" href="#">'+
                    thisRound.roundType.name+
                    '<p>'+thisRound.creator.name+"  |   "+formattedDateTime (thisRound.createdAt)+'</p>' +
                    '</a></li>');
      controller_addJoinRoundController (thisRound.id, thisRound.numEnds, thisRound.numArrowsPerEnd);
    }
  });
};  //cds_getJoinableRoundsList



function cds_endSum (arr) {
  var total = 0;
  for(var i in arr) { 
    if (arr[i] != -1) total += arr[i]; 
  }
  return total;
};


function cds_loadRoundInfo (thisRoundID) {
  roundID = thisRoundID;
  // console.log ("loading round info for "+roundID);
  var thisRoundRef = FirebaseClubRef.child("rounds/"+roundID);
  thisRoundRef.once('value', function(snapshot) {
      var thisRoundInfo = snapshot.val();
      // console.log (thisRoundInfo);
      numArrowsPerEnd = thisRoundInfo.numArrowsPerEnd;
      numEnds = thisRoundInfo.numEnds;
      roundType = thisRoundInfo.roundType.name;
      $('#roundType').html(roundType);
      roundDate = formattedDateTime(thisRoundInfo.createdAt);
      $('#roundDetails1').html("Created "+ roundDate);
      roundCreator = thisRoundInfo.creator.name;
      $('#roundDetails2').html("by "+ roundCreator);
      $('#scoreTable').html ("");

      //// console.log ("loading data from "+"rounds/"+roundID+"/scores/users/"+FirebaseUserID+"/data/");
      //Data Load
      var thisRoundScoresRef = FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID+"/data/");
      thisRoundScoresRef.once('value', function(snapshot) {
          currentRoundData = snapshot.val();
          var thisData = snapshot.val();
          // console.log  ("data retrieved ="+currentRoundData);
          totalArrows = 0;
          totalScore = 0;
          for (var i = 0; i < numEnds; i++) {
            thisScoreString = ""; 
            for (var j = 0; j < numArrowsPerEnd; j++) {
              if (thisData[i][j] >= 0) {
                thisScoreString = thisScoreString + thisData[i][j] + "  ";
                totalArrows += 1;
                totalScore += thisData[i][j];
              } else {
                thisScoreString += "-  ";
              }
            };
            $('#numArrows').html("Arrows:" + totalArrows);
            $('#totalScore').html("Total:" + totalScore);
            if (totalArrows > 0) {average = totalScore/totalArrows} else {average = 0;}
            $('#average').html("Avg:" + Math.round(average * 100) / 100);
            $('#scoreTable').append ('<li class="table-view-cell">'+
                '<a id="end'+i+'"" class="navigate-right" href="#" data-transition="slide-in">'+
                  thisScoreString + ' = ' + cds_endSum(thisData[i])+
                '</a></li>'); 
            controller_addEndController("end"+i, roundID, i);     
          };
      });

      //Load Round User Status
      var thisRoundStatusRef = FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID+"/status/");
      thisRoundStatusRef.once('value', function(snapshot) {
          currentRoundStatus = snapshot.val();
          complete = currentRoundStatus.complete;
          currentArrow = currentRoundStatus.currentArrow;
          currentEnd = currentRoundStatus.currentEnd;
          totalArrows = currentRoundStatus.totalArrows;
          totalScore = currentRoundStatus.totalScore;
      });

  });
}//cds_loadRoundInfo

function cds_startLeaderboard (){
  var thisRoundLeaderboardRef = FirebaseClubRef.child("rounds/"+roundID+"/scores/users/");
  thisRoundLeaderboardRef.on('value', function(snapshot) {
    var userArr = [];
      leaderboard = snapshot.val();
      //// console.log (leaderboard);
      for (var thisuser in leaderboard){
        // console.log ("leaderboard user found: " + leaderboard[thisuser].name);
        if (leaderboard[thisuser].status.totalArrows > 0) {
          thisaverage = leaderboard[thisuser].status.totalScore/leaderboard[thisuser].status.totalArrows;
        } else {
          thisaverage = 0;
        }
        var userObj = {name: leaderboard[thisuser].name, 
                        average: thisaverage, 
                        arrows : leaderboard[thisuser].status.totalArrows,
                        total : leaderboard[thisuser].status.totalScore};
        userArr.push(userObj);
      };
      userArr.sort(function (a, b) {
        if (a.average > b.average) {
          return -1;
        }
        if (a.average < b.average) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
      $('.leaderboard').html('<div class="div-table-row ">'+
                '<div class="div-table-col div-table-header-row col1" >Leaderboard</div>'+
                '<div  class="div-table-col div-table-header-row col2" align="center">Arws</div>'+
                '<div  class="div-table-col div-table-header-row col3" align="center">Tot</div>'+
                '<div  class="div-table-col div-table-header-row col4" align="center">Avg</div> '+
             '</div>');
      for (var user in userArr) {
          $('.leaderboard').append (' <div class="div-table-row">'+
                '<div class="div-table-col col1">'+userArr[user].name+'</div>'+
                '<div class="div-table-col col2" align="center">'+userArr[user].arrows+'</div>'+
                '<div class="div-table-col col3" align="center"><b>'+userArr[user].total+'</b></div>'+
                '<div class="div-table-col col4" align="center">'+Math.round(userArr[user].average*100)/100+'</div>'+
                '</div>');
      }
  });

}//cds_startLeaderboard


function cds_loadJoinRoundInfo (thisRoundID) {
  roundID = thisRoundID;
  // console.log ("loading round info for "+roundID);
  var thisRoundRef = FirebaseClubRef.child("rounds/"+roundID);
  thisRoundRef.once('value', function(snapshot) {
      var thisRoundInfo = snapshot.val();
      // console.log (thisRoundInfo);
      roundType = thisRoundInfo.roundType.name;
      $('#join_roundType').html(roundType);
      roundDate = formattedDateTime(thisRoundInfo.createdAt);
      $('#join_roundDate').html("Created "+ roundDate);
      roundCreator = thisRoundInfo.creator.name;
      $('#join_roundCreator').html("by "+ roundCreator);   
  });
}//cds_loadJoinRoundInfo



var cds_onWriteComplete = function(error) {
    if (error) {
      // console.log("Error saving data to firebase");
    } else {
      // console.log("Firebase save OK");
    }
  };

function cds_saveUser (id, Surname, FirstName, Name, Email) {
  //// console.log ("in cds_saveUser "+ id + "  " + Surname + "  " + FirstName + "  " + Name + "  " + Email);
  var usersRef = FirebaseClubRef.child("users");
  var userData = '{'+
                  '"id" : "'+id+'", '+
                  '"surname" : "'+Surname+'", '+
                  '"firstname" : "'+FirstName+'", '+
                  '"name" : "'+Name+'", '+
                  '"email" : "'+Email+'"'+
                  '}';
  userObj = JSON.parse(userData);
  // console.log (userObj);
  usersRef.child(id).update(userObj, cds_onWriteComplete);

};//cds_saveUser

function cds_createUser (Email) {
  var password = "";
  for (var i = 0; i < 6; i++) {
   var passwordInt = Math.floor(Math.random()*9);
   password += passwordInt;
  };
  // console.log ("Generated new Password : " + password);
  FirebaseClubRef.createUser(Email, password);
  //create username and password....
}; //cds_createUser

function cds_getClubDetails (){
  FirebaseRef.child(clubID)
}

//- - - - - - - - - - - - - - - - - - -  SAVE DATA TO CDS - - - - - - - - - - - - - - - - - - - - //

function cds_createRound (){
  var onSaveComplete = function(error) {
      if (error) {
        errortext = "Error saving data to Firebase"; 
        alert (errortext);
        // console.log(errortext);
      } else {
        // console.log('Data saved to Firebase successfully');
      }
    };

    var new_RoundTypeID = roundTypeID;
    var thisFirebaseRoundTypesRef = FirebaseRoundTypesRef.child(newRoundTypeID);
    thisFirebaseRoundTypesRef.once('value', function(snapshot) {
      var thisRoundTypeInfo = snapshot.val();
      // console.log ("creating round from type : "+thisRoundTypeInfo);
      var newRoundComment = $('#input_newRoundComment').val();
      var newRoundID = uuid();
        //status
      var newRoundData =  '{"id" : "' + newRoundID +'"'+
                    ', "comment" : "'+ newRoundComment + '"'+
                    ', "createdAt" : ' +Date.now()+
                    ', "creator" : {"id": "'+ userID+'"'+
                    ', "name" : "'+FirebaseName+'"}'+
                    ', "isPublic" : true'+
                    ', "numEnds" :'+thisRoundTypeInfo.numEnds+
                    ', "numArrowsPerEnd" : '+thisRoundTypeInfo.numArrowsPerEnd+
                    ', "roundType" : {"description" : "'+ thisRoundTypeInfo.description+'"'+
                    ', "id" : "'+thisRoundTypeInfo.id+'"'+
                    ', "name" : "'+thisRoundTypeInfo.name+'"}'+
                    '}';
      //// console.log(newRoundData);
      newRoundObj = JSON.parse(newRoundData);
      //// console.log ("new Round Object = ");
      //// console.log (newRoundObj);    
      FirebaseClubRef.child("rounds/"+newRoundID).update(newRoundObj, onSaveComplete);
      // console.log ("wrote new  round : "+newRoundID);
      cds_joinRound (newRoundID, thisRoundTypeInfo.numEnds, thisRoundTypeInfo.numArrowsPerEnd);
    });

}; //cds_createRound

function cds_joinRound (new_RoundID, new_numEnds, new_numArrowsPerEnd){

  var onSaveComplete = function(error) {
      if (error) {
        errortext = "Error saving data to Firebase"; 
        alert (errortext);
        // console.log(errortext);
      } else {
        // console.log('Data saved to Firebase successfully');
      }
    };

  roundID = new_RoundID;  
  //Data
  var roundData = '{"data" : [';
  for (var i = 0; i < new_numEnds; i++) {
    roundData += '[';
    for(var j=0; j<new_numArrowsPerEnd; j++){ 
      roundData += "-1,"; 
    };
    n = roundData.length;
    var trimData = roundData.substring(0, n-1);
    roundData = trimData + "],";
  }
  n = roundData.length;
  trimData = roundData.substring(0, n-1);
  roundData = trimData + ']}';
  // console.log (roundData);
  dataObj = JSON.parse(roundData);
  if (dataObj == null) {alert ("Error Parsing JSON for round Data");};
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID).update(dataObj, onSaveComplete);

  //status
  var statusData =  '{"status" : {"complete" : false'+
                    ', "currentArrow" : 0'+
                    ', "currentEnd" : 0'+
                    ', "totalArrows" : 0'+
                    ', "totalScore" : 0 }}';
  statusObj = JSON.parse(statusData);
  if (statusObj == null) {alert ("Error Parsing JSON for status Data");};
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID).update(statusObj, onSaveComplete);
  
  var nameData = '{"name" : "'+ FirebaseName+'"}';
  nameObj = JSON.parse(nameData);
  if (nameObj == null) {alert ("Error Parsing JSON for name Data");};
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID).update(nameObj, onSaveComplete);

  //updatedAt
  var updatedAt = '{"updatedAt" : ' +Date.now() + '}';
  // console.log (updatedAt);
  updatedAtObj = JSON.parse (updatedAt);
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID).update(updatedAtObj, onSaveComplete);
  FirebaseClubRef.child("rounds/"+roundID+"/scores/").update(updatedAtObj, onSaveComplete);

  var usersUpdatedAt = '{"'+roundID+'" : ' +Date.now() + '}';
  usersUpdatedAtObj = JSON.parse (usersUpdatedAt);
  FirebaseClubRef.child("users/"+userID+"/rounds/").update(usersUpdatedAtObj, onSaveComplete);
} //cds_joinRound



function cds_saveEnd (endNo){
  var onSaveComplete = function(error) {
      if (error) {
        errortext = "Error saving data to Firebase"; 
        alert (errortext);
        // console.log(errortext);
      } else {
        // console.log('Data saved to Firebase successfully');
      }
    };

  //data
    var endData = '{"'+endNo+'" : [';
  for(var j=0; j<numArrowsPerEnd; j++){
    thisScore = currentRoundData[endNo][j] 
    endData += thisScore+","; 
  };
  n = endData.length;
  var trimData = endData.substring(0, n-1);
  roundData = trimData + "]}";
  // console.log (roundData);
  dataObj = JSON.parse(roundData);
  if (dataObj == null) {alert ("Error Parsing JSON for score data");};
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID+"/data/").update(dataObj, onSaveComplete);

  //user
  var statusData = '{"complete" : '+complete+
                    ', "currentArrow" : '+currentArrow +
                    ', "currentEnd" : '+currentEnd +
                    ', "totalArrows" : '+totalArrows +
                    ', "totalScore" : '+totalScore + ' }';
  statusObj = JSON.parse(statusData);
  if (statusObj == null) {alert ("Error Parsing JSON for scores record");};
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID+"/status").update(statusObj, onSaveComplete);
  
  //updatedAt
  var updatedAt = '{"updatedAt" : ' +Date.now() + '}';
  // console.log (updatedAt);
  updatedAtObj = JSON.parse (updatedAt);
  FirebaseClubRef.child("rounds/"+roundID+"/scores/users/"+userID).update(updatedAtObj, onSaveComplete);
  FirebaseClubRef.child("rounds/"+roundID+"/scores/").update(updatedAtObj, onSaveComplete);
  
  var usersUpdatedAt = '{"'+roundID+'" : ' +Date.now() + '}';
  usersUpdatedAtObj = JSON.parse (usersUpdatedAt);
  FirebaseClubRef.child("users/"+userID+"/rounds/").update(usersUpdatedAtObj, onSaveComplete);
} //cds_saveEnd

//- - - - - - - - - - - - - ALL ABOVE HERE IS NEEDED FOR CLoudArchery UserManager - - - - - - - - - - - - - - - - //
//- - - - - - - - - - - - - - - BELOW HERE IS FROM PREVIOUS WEB IMPLIMENTATIONS - - - - - - - - - - - - - - - - - //



function getScoreArrayFirebase (user, round) { // - - - - - - - - - - - - - - - - - - - - -//
    var scoreRef = FirebaseRef.child('scores/'+user+'/round'+round);
    //alert(scoreRef);
    var scoreData = null;
    scoreRef.once('value', function(snapshot) {
		scoreData = snapshot.val();
		//alert (JSON.stringify(scoreData));
		if (scoreData == null) {
      		 $('#recordScorePage').hide();
      	//	$('#newRecordButton').show();
           //alert ('no record found');
        $('#raisedButton').show();
      $ ('#newRecordPage').show();
        
  		} else {
  			scoreArray = scoreData.data;
    		$("#scoreArray").html(makeTableHTML (scoreArray));
    		$("#total").html("total= "+Total);  

    		lastArrow = document.getElementById ('end_0_0');
  			$(lastArrow).addClass('selectedArrow');

  			//$(":input").click(function() {
        $("[id^='end_']").click(function() {

  				//alert ("input clicked : "+this.id);
  				endId = parseInt(this.id.substring(4, 5));
			   	arrowId = parseInt(this.id.substring(6, 7));
			    //alert ("id is : "+this.id);
			    //alert($(this).attr("id"));
			    $(lastArrow).removeClass('selectedArrow');
			    lastArrow = this;
			    $(lastArrow).addClass('selectedArrow');
  			});
  		}; 
	});
}; //function getScoreArrayFirebase - - - - - - - - - - - - - - - - - - - - -  - - - - - - - //


function saveEndFirebase (user, round, end, endscores, total) { // - - - - - - - - - - - - - //
	//alert ('in');
  roundInt = round-1;   //offset between array and id
  round = "round"+round;

	var onScoresComplete = function(error) {
    if (error) {
      errortext = "Error saving scores/user/round/data"; 
      alert (errortext);
      // console.log(errortext);
    } else {
      //// console.log('Synchronization succeeded');
    }
  };

  var onScoresTotalComplete = function(error) {
    if (error) {
      errortext = "Error saving scores/user/round/total"; 
      alert (errortext);
      // console.log(errortext);
    } else {
      alert ("save good");
      //// console.log('Synchronization succeeded');
    }
  };

  var onRoundsTotalComplete = function(error) {
    if (error) {
      errortext = "Error saving rounds/round/scores"; 
      alert (errortext);
      // console.log(errortext);
    } else {
      //// console.log('Synchronization succeeded');
    }
  };  

  var onUserTotalComplete = function(error) {
    if (error) {
      errortext = "Error saving users/user/scores"; 
      alert (errortext);
      // console.log(errortext);
    } else {
      alert ("good");
      //// console.log('Synchronization succeeded');
    }
  }; 

  var endData = '"'+end+'" : [';
	for(var j=0; j<arrowsPerEnd; j++){
	  thisScore = endscores[j];
	  endData += thisScore+","; 
	  //alert (endData);
	};
	n = endData.length;
	var trimData = endData.substring(0, n-1);
	trimData += "]";
	//alert (trimData);
	obj = JSON.parse("{"+trimData+"}");
	//alert(obj);



	FirebaseRef.child("scores/"+user+"/"+round+"/data").update(obj, onScoresComplete); 

	var totalData = '{"score" : '+total+'}';
	var roundData = '{"'+userID+'" : '+total+'}';
  var userData = '{"'+round+'" : '+total+'}';
	//alert (roundObj);
	totalObj = JSON.parse(totalData);
  if (totalObj == null) {alert ("Error Parsing JSON for scores record");};
	roundObj = JSON.parse(roundData);
  if (roundObj == null) {alert ("Error Parsing JSON for rounds record");};
  userObj = JSON.parse(userData);
  if (userObj == null) {alert ("Error Parsing JSON for users record");};
  //alert (userObj);
  //alert ('FirebaseRef is :'+FirebaseRef);

	FirebaseRef.child("scores/"+user+"/"+round).update(totalObj, onScoresTotalComplete);
	FirebaseRef.child("rounds/"+roundInt+"/scores").update(roundObj, onRoundsTotalComplete);
	FirebaseRef.child("users/"+user+"/scores").update(userObj, onUserTotalComplete);

  //alert ("user is: "+user+",     round is: "+round);

}; //function saveEndFirebase - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

function createRoundFirebase (newdate, newroundtype, newends, newarrowsperend) {
  i=0;
  do {
    i++;
    test=rounds['round'+i];

    //alert (test);
  }  while ((test!==undefined)&(i<100000));
  //alert(i);  
  //alert (newdate);
  var newRoundData = '{"date" : "'+newdate+'", "id" : "round'+i+'", "arrowsperend" : '+newarrowsperend+', "roundType" : "'+newroundtype+'", "ends" : '+newends+'}';
  //alert (newRoundData);
  newRoundObj = JSON.parse(newRoundData);
  i = i-1;   //Round index in JSON array starts at Zero, but round counting starts at 1
  FirebaseRef.child("rounds/"+i).set(newRoundObj);
};//function createRoundFirebase - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - // 
