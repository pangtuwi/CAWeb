function getUrlVars() {
	var vars = {};
	//according to Dyl you could use window.location.search, but this works....
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
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
	console.log ("oldArrowVal = "+ oldArrowVal);
	currentRoundData[currentEnd][currentArrow] = arrowVal;
	console.log ("currentRoundData = "+ currentRoundData);

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
		PUSH ({url: backURL, transition: 'slide-in'});
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
    		total += parseInt(this);
		});
	});
	console.log (" total calculated as "+ total);
	return total;
}


//console.log ("running editscores.js");
thisRoundID = getUrlVars()["id"];
currentEnd = getUrlVars()["currentEnd"];
if (currentArrow == numArrowsPerEnd) currentArrow = 0;
currentEndTotal = 0;
totalScore = getRoundTotal(currentRoundData);

//console.log ("Current End Data  ="+currentRoundData[currentEnd]);

writeCurrentEnd();

//console.log ("End Selected = "+currentEnd);

$(".btn-del").on("touchend", function() {
	deleteScore();
});

$(".btn-clr").on("touchend", function() {
	clearScore();
});

$("[data-score]").on("touchend", function() {
	//example from Dylan
	//console.log(this, $(this).attr('data-score'));
	score ($(this).attr('data-score'));
});

//Set up buttons for navigation

backURL = 'scores.html?id='+thisRoundID;

$(".btn-back").html ('<a class="icon icon-left-nav pull-left" href="'+backURL+'" data-transition="slide-out"></a>');

$(".btn-cancel").on("touchend", function() {
	PUSH ({url: backURL, transition: 'slide-in'});
});

$(".btn-save").on("touchend", function() {
	cds_saveEnd(currentEnd);
	PUSH ({url: backURL, transition: 'slide-in'});
});




