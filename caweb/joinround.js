function getUrlVars() {
	var vars = {};
	//according to Dyl you could use window.location.search, but this works....
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

thisRoundID = getUrlVars()["id"];
thisNumEnds = getUrlVars()["numE"];
thisNumApE = getUrlVars()["numApE"]; //numArrowsPerEnd
backURL = 'joinlist.html';

$(".btn-canceljoin").on("touchend", function() {
	PUSH ({url: backURL, transition: 'slide-in'});
});

$(".btn-join").on("touchend", function() {
	cds_joinRound(thisRoundID, thisNumEnds, thisNumApE);
	PUSH ({url: "../caweb.html", transition: 'slide-in'});
});


cds_loadJoinRoundInfo (thisRoundID);