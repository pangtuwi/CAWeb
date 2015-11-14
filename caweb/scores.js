function getUrlVars() {
	var vars = {};
	//according to Dyl you could use window.location.search, but this works....
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function score (newscore) {
	console.log ("scored "+newscore);
}

thisRoundID = getUrlVars()["id"];
console.log ("RoundID Selected = "+thisRoundID);
cds_loadRoundInfo (thisRoundID);
cds_startLeaderboard();
