// Here we check to make sure that an opponent
// and starting health were selected. If not, then
// send the player back to the menu
var startLife = 10;
var computer = "true";
if(window.location.href.indexOf("?") > 0)
{
	var infoString = window.location.href.toString().split("?")[1];
	if(infoString.match(/cpu=true|cpu=false/) && infoString.match(/health=\d+/))
	{
		computer = infoString.match(/true|false/).toString();
		startLife = parseInt(infoString.match(/health=\d+/gi).toString().replace("health=", ""));
		if(startLife > 10)
		{
			startLife = 10;
		}
		if(startLife <= 0)
		{
			startLife = 1;
		}
	}
	else
	{
		window.location = "/side-projects/rock-paper-scissors/";
	}
}
else
{
	window.location = "/side-projects/rock-paper-scissors/";
}