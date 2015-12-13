function controller_hideall(){
	$("#caweb").hide();
	$("#login2").hide();
	$("#myRounds").hide();
	$("#joinList").hide();
	$("#joinRound").hide();
	$("#createRound").hide();
	$("#roundTypeList").hide();
	$("#settings").hide();
	$("#statistics").hide();
	$("#backup").hide();
	$("#about").hide();
	$("#scores").hide();
	$("#editScores").hide();
	$(".icon-left-nav").hide();
}

function controller_login(){
	controller_hideall();
	$("#login2").show();
	$("#pageTitle").html("CloudArchery-Login");
	var authParamObj = lds_loadAuthInfo();
	if (authParamObj != null) {
		$(".inputClubName").val(authParamObj["clubname"]);
		$(".inputEmail").val(authParamObj["email"]);
		$(".inputPassword").val(authParamObj["password"]);
	}
}

function controller_mainpage(){
	controller_hideall();
	$("#caweb").show();
	$("#pageTitle").html("CloudArchery v"+ CAWebVersion);
	cds_checkDatabaseConnection();
}

function controller_myRounds(){
	if (FirebaseAuthenticated){
		controller_hideall();
		$("#myRounds").show();
		$("#pageTitle").html("CloudArchery - My Rounds");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_mainpage);
		cds_getMyRoundsList();
	};
}

function controller_joinRoundList(){
	if (FirebaseAuthenticated){
		controller_hideall();
		$("#joinList").show();
		$("#pageTitle").html("CloudArchery - Join Round");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_mainpage);
		cds_getJoinableRoundsList();
	};
}

function controller_createRound(){
	if (FirebaseAuthenticated){
		controller_hideall();
		$("#createRound").show();
		$("#pageTitle").html("CloudArchery - Create Round");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_mainpage);
		newRoundTypeID = roundTypeID;
		$("#roundTypeName").html(roundTypeName);
	};
}

function controller_roundTypeList(){
	controller_hideall();
	$("#roundTypeList").show();
	$("#pageTitle").html("CloudArchery - Select Round Type");
	$(".icon-left-nav").show();
	$(".icon-left-nav").on ("click", controller_createRound);
	cds_getRoundTypeList();
}

function controller_settings(){
	controller_hideall();
	$("#settings").show();
	$("#pageTitle").html("CloudArchery - Settings");
	$(".icon-left-nav").show();
	$(".icon-left-nav").on ("click", controller_mainpage);
}

function controller_statistics(){
	if (FirebaseAuthenticated){
		controller_hideall();
		$("#statistics").show();
		$("#pageTitle").html("CloudArchery - Statistics");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_settings);
	};
}

function controller_backup(){
	if (FirebaseAuthenticated){
		controller_hideall();
		$("#backup").show();
		$("#pageTitle").html("CloudArchery - Backup");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_settings);
		action_getBackupData();
	};
}

function controller_about(){
	controller_hideall();
	$("#about").show();
	$("#pageTitle").html("CloudArchery - About");
	$(".icon-left-nav").show();
	$(".icon-left-nav").on ("click", controller_settings);
}

function controller_addRoundController(thisRoundID){
	$('#'+thisRoundID).on ("click", function(){
		controller_hideall();
		$("#scores").show();
		$("#pageTitle").html("CloudArchery - Round Detail");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_myRounds);
		cds_loadRoundInfo (thisRoundID);
		cds_startLeaderboard();
    });
}

function controller_addRoundTypeController(thisRoundTypeID, thisRoundTypeName){
	$('#'+thisRoundTypeID).on ("click", function(){
		roundTypeID = thisRoundTypeID;
		roundTypeName = thisRoundTypeName;
		// console.log ("RoundTypeName set to "+ thisRoundTypeName);
		controller_createRound();
    });
    //// console.log ("controller added for RoundTypeID = "+thisRoundTypeID);
}

function controller_addJoinRoundController(thisRoundID, thisNumEnds, thisNumArrowsPerEnd){
	$('#'+thisRoundID).on ("click", function(){
		controller_hideall();
		$("#joinRound").show();
		$("#pageTitle").html("CloudArchery - Confirm Join");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", controller_joinRoundList);
		action_joinRound(thisRoundID, thisNumEnds, thisNumArrowsPerEnd);
    });
}

function controller_addEndController(thisNavID, thisRoundID, thisEndID){
	$('#'+thisNavID).on ("click", function(){
		controller_hideall();
		$("#editScores").show();
		$("#pageTitle").html("CloudArchery - Score End");
		$(".icon-left-nav").show();
		$(".icon-left-nav").on ("click", function(){
			$("#"+thisRoundID).trigger("click");
		});
		$(".btn-cancel-edit").on("click", function() {
			$("#"+thisRoundID).trigger("click");
		});
		// console.log ("end controller added");
		action_editScores(thisEndID);
    });
}

function doNothing(){

}//doNothing

function controller_initialise(){
	controller_mainpage();
	$(".onlyIfAuth").css('color', 'grey');

	$("#btn-login").on ("click", function (){
		action_login();
		controller_mainpage()
	});

	$("#btn-createRound").on ("click", function (){
		cds_createRound ();
		controller_mainpage()
	});

	$("#nav-myRounds").on ("click", controller_myRounds);
	$("#nav-joinRoundList").on ("click", controller_joinRoundList);
	$("#nav-createRound").on ("click", controller_createRound);
	$("#nav-roundTypeList").on ("click", controller_roundTypeList);
	$("#nav-settings").on ("click", controller_settings);
	$("#nav-login").on ("click", controller_login);
	$("#nav-statistics").on ("click", controller_statistics);
	$("#nav-backup").on ("click", controller_backup);
	$("#nav-about").on ("click", controller_about);

	$("#version").html ("Version "+ CAWebVersion);
}

