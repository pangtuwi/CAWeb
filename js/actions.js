function action_login(){
	FirebaseEmail = $(".inputEmail").val();
	console.log ("Email is: ")+FirebaseEmail;
	FirebaseClubName = $(".inputClubName").val();
	console.log ("Club is: ")+FirebaseClubName;
	FirebasePassword = $(".inputPassword").val();
	console.log ("Password is: ")+FirebasePassword;
	lds_saveAuthInfo(FirebaseClubName, FirebaseEmail, FirebasePassword);
}

function action_editScores(thisEndID){
	console.log ("running action_editscores");
	alert ("runin");
	currentEnd = thisEndID;
	if (currentArrow == numArrowsPerEnd) currentArrow = 0;
	currentEndTotal = 0;
	totalScore = getRoundTotal(currentRoundData);

	writeCurrentEnd();

	$(".btn-del").off();
	$(".btn-del").on("click", function() {
		deleteScore();
	});

	$(".btn-clr").off();
	$(".btn-clr").on("click", function() {
		clearScore();
	});
	$("[data-score]").off();
	$("[data-score]").on("click", function() {
		score ($(this).attr('data-score'));
	});

	$(".btn-save").off();
	$(".btn-save").on("click", function() {
		cds_saveEnd(currentEnd);
		$("#"+roundID).trigger("click");
	});
}

function action_joinRound(thisRoundID, thisNumEnds, thisNumApE){

	$(".btn-canceljoin").on("click", function() {
		controller_joinRoundList();
	});

	$(".btn-join").on("click", function() {
		cds_joinRound(thisRoundID, thisNumEnds, thisNumApE);
		controller_mainpage();
	});

	cds_loadJoinRoundInfo (thisRoundID);
}


function arrowClassColor (currentArrowValue) {
	var currentArrowClass = "";
	switch(currentArrowValue) {
	    case 10:
	        currentArrowClass = "badge-gold";
	        break;
	    case 8:
	        currentArrowClass = "badge-red";
	        break;
	    case 6:
	        currentArrowClass = "badge-blue";
	        break;
	    case 4:
	        currentArrowClass = "badge-black";
	        break;
	    case 2:
	        currentArrowClass = "badge-white";
	        break;
	    case 0:
	        currentArrowClass = "badge";
	        break;                
	    default:
	        currentArrowClass = "badge"; 
	}
	return currentArrowClass;
} //arrowClassColor

function writeCurrentEnd () {
	outString = "";
	currentEndTotal = 0;
	for (var i = 0; i < numArrowsPerEnd; i++) {
		thisScore = currentRoundData[currentEnd][i];
		if (thisScore != -1) {
			currentEndTotal += parseInt(thisScore);
		} else {
			thisScore = "-";
		}
		if (i == currentArrow) {
			outString = outString + "<b><big>" + thisScore + "</big></b>  ";
		} else {
			outString = outString + thisScore + "  ";
		}
	};

	outString = outString + " &nbsp; &nbsp; &nbsp; &nbsp; (" + currentEndTotal + ")";
	$("#endScores").html(outString);
}

function score (arrowVal) {
	//Set new Arrow Value
	console.log("in Function score");
	console.log ("...currentRoundData = "+ currentRoundData);
	console.log ("...currentEnd = "+ currentEnd);
	console.log ("...currentArrow = "+ currentArrow);
	console.log ("...numEnds = "+ numEnds);
	console.log ("...numArrowsPerEnd = "+ numArrowsPerEnd);

	oldArrowVal = parseInt (currentRoundData[currentEnd][currentArrow]);
	if (oldArrowVal == -1) {
		totalArrows +=1;
		oldArrowVal = 0;
	};
	//console.log ("oldArrowVal = "+ oldArrowVal);
	currentRoundData[currentEnd][currentArrow] = arrowVal;
	//console.log ("currentRoundData = "+ currentRoundData);

	//Recalculate End
	currentEndTotal = 0;
	$.each(currentRoundData[currentEnd],function() {
    	if (this != -1) currentEndTotal += parseInt(this);
	});
	console.log ("currentEndTotal = "+ currentEndTotal);

	//recalculate totals
	totalScore = parseInt(totalScore) + parseInt(arrowVal) - parseInt(oldArrowVal);
	
	//Set Current Arrow
	currentArrow = parseInt(currentArrow) + 1;
		//check if end done, if do, then update end and exit back to previous page
	if (currentArrow == numArrowsPerEnd) {
		currentArrow = 0;
		cds_saveEnd(currentEnd);
		currentEnd = parseInt(currentEnd) + 1;
		$("#"+roundID).trigger("click");
	}

	//Check Current End
	if (currentEnd == numEnds) {
		currentEnd = 0;
	}

	//write arrow scores to page
	writeCurrentEnd();
	console.log ("Scored "+ arrowVal + ", Total = " + totalScore +
			 ", currentArrow = "+ currentArrow + ", totalArrows = "+ totalArrows);

	//Check if Complete
	
} //score

function deleteScore(){
	console.log("in Function DELETE score");
	console.log ("...currentRoundData = "+ currentRoundData);
	console.log ("...currentEnd = "+ currentEnd);
	console.log ("...currentArrow = "+ currentArrow);
	console.log ("...numEnds = "+ numEnds);
	console.log ("...numArrowsPerEnd = "+ numArrowsPerEnd);

	//Set Current Arrow
	if (currentArrow > 0) currentArrow = parseInt(currentArrow) - 1;

	oldArrowVal = parseInt (currentRoundData[currentEnd][currentArrow]);
	if (oldArrowVal == -1) oldArrowVal = 0;
	console.log ("oldArrowVal = "+ oldArrowVal);
	currentRoundData[currentEnd][currentArrow] = -1;
	console.log ("currentRoundData = "+ currentRoundData);

	//Recalculate End
	currentEndTotal = 0;
	$.each(currentRoundData[currentEnd],function() {
    	if (this != -1) currentEndTotal += parseInt(this);
	});
	console.log ("currentEndTotal = "+ currentEndTotal);

	//recalculate totals
	totalArrows -= 1;
	totalScore = parseInt(totalScore) - parseInt(oldArrowVal);
	

	//write arrow scores to page
	writeCurrentEnd();

} //deleteScore

function clearScore(){
	currentArrow = 0;
	for (var i = 0; i < numArrowsPerEnd; i++) {
		currentRoundData[currentEnd][i] = -1;
	}
	writeCurrentEnd();
}//clearScore

function getRoundTotal (thisRound) {
	total = 0;
	$.each(thisRound,function() {
		$.each(this,function() {
			if (parseInt(this) != -1) total += parseInt(this);
		});
	});
	console.log (" total calculated as "+ total);
	return total;
}