/* ----------------------------------------------------------------------------------------------------------------------------

	Functions.js - Engine for High Kick, Low Kick, Punch
	Copyright Jamie Keomanivong

---------------------------------------------------------------------------------------------------------------------------- */


// ----------------------------------------------------------------------------------------------------------------------------
// Generic methods/events
// ----------------------------------------------------------------------------------------------------------------------------

// Force Firefox to clear the action fields on load
// ----------------------------------------------------------------------
$(function() {
	setTimeout(function() {
		$("#p1-attacks, #p2-attacks").val("")
	}, 100);
});

// Show/hide the instructions
// ----------------------------------------------------------------------
$(".desc:nth-child(6), .desc:nth-child(7)").on("click", function() {
	$(".desc").fadeToggle("fast");
});


// ----------------------------------------------------------------------------------------------------------------------------
// Character setup and game initialization
// ----------------------------------------------------------------------------------------------------------------------------

var actionCount = 1; // Number of available actions
var actionCountTemp = 1; // Temporary number of available actions used to reset the actionCount
var cpuArray = ["punch", "high-kick", "low-kick"];

// Show the correct amount of stamina under the player's life bar
// ----------------------------------------------------------------------
function showStamina(player, playerMeter) {
	var spans = "";
	switch(player.stamina) {
		case 1:
			spans = "<span></span>";
			break;
		case 2:
			spans = "<span></span><span></span>";
			break;
		case 3:
			spans = "<span></span><span></span><span></span>";
			break;
	}
	// If setting player 1 put the stamina block on the right. If player 2 put them on the left.
	playerMeter == "#player1-meter" ? $(playerMeter).children("p").html("Stamina" + spans) : $(playerMeter).children("p").html(spans + "Stamina");
}

// Show the correct health of the player
// ----------------------------------------------------------------------
function showHealth(player, el) {
	var percent = (player.health * 10) + "%"
	$(el).children(".health-bar").css("width", percent);
	console.log("Health has been updated");
}

// Initialize game data
// ----------------------------------------------------------------------
function init(p1, p2) {
	// Clear the "Ready!" placeholder that was added from the previous round
	$(".action-box").removeAttr("disabled").removeAttr("placeholder");
	// If the opponent is the AI then disable its actions field
	if(computer == "true") {
		$("#p2-attacks.action-box").attr("disabled", "disabled").attr("placeholder", "CPU");
	}
	actionCount = actionCountTemp;
	// Set the player stamina to the latest stamina
	player1.liveStamina = player1.stamina;
	player2.liveStamina = player2.stamina;
	// Show the current health and stamina for each player
	showHealth(player1, "#player1-meter");
	showHealth(player2, "#player2-meter");
	showStamina(player1, "#player1-meter");
	showStamina(player2, "#player2-meter");
	// Set the life bars to the correct colors depending on the amount of health
	checkLifeBars();
	// Show the current number of actions
	$("#action-count").html(actionCount);
}

// Define our player object and create players
// ----------------------------------------------------------------------
var player = function(settings) {
	this.health = settings.health;
	this.stamina = settings.stamina; // Current in game stamina. Will change on the fly throughout each round
	this.liveStamina = settings.stamina; // Base stamina that will only change at the begining of each round
	this.name = settings.name;
	this.short = settings.short; // Short name
	
	this.dead = false;
	this.actions = []; // Array to hold the currently selected actions
	this.ready = false; // Flag to detect if both players are ready
}
var player1 = new player({
	health:startLife,
	actionCount:1,
	stamina:1,
	name:"muay-thai-mark",
	short:"mtm"
});

var player2 = new player({
	health:startLife,
	actionCount:1,
	stamina:1,
	name:"kung-fu-kirk",
	short:"kfk"
});

init(player1, player2);


// ----------------------------------------------------------------------------------------------------------------------------
// Game methods
// ----------------------------------------------------------------------------------------------------------------------------

// Durations so that animated GIFs work together
var animationLength = 1200;
var strikePause = 3000;
var finishTime = 1700;

// Attack
// ----------------------------------------------------------------------
function action(p, c, a) {
	// Get the current player's image element
	var player = $(p).children(".player").children("img");
	var character = c, action = a;
	
	// Select the correct GIF animation and then reset it upon completion
	player.attr("src", character + "/" + action + ".gif");
	setTimeout(function() {
		player.attr("src", character + "/stance.gif");
	}, animationLength);
}

// Detect player actions
// ----------------------------------------------------------------------
$("#p1-attacks, #p2-attacks").on("keyup", function(event) {
	// If both players aren't ready then we'll continue
	// to check keypresses and add attacks to their
	// action lists
	if(player1.ready == false || player2.ready == false) {
		var player = "#" + $(this).attr("data-player");
		if(player == "#player-1")
		{
			switch(event.which)
			{
				case 65: // If A is pressed
					checkReady(player1, player, "punch");
					break;
				case 83: // If S is pressed
					checkReady(player1, player, "high-kick");
					break;
				case 68: // If D is pressed
					checkReady(player1, player, "low-kick");
					break;
				default:
					// If an incorrect key is pressed then remove it from the action box
					$("#p1-attacks").val($("#p1-attacks").val().substr(0, $("#p1-attacks").val().length - 1));
			}
		}
		else if(computer == "false")
		{
			switch(event.which)
			{
				case 74: // If J is pressed
					checkReady(player2, player, "punch");
					break;
				case 75: // If K is pressed
					checkReady(player2, player, "high-kick");
					break;
				case 76: // If L is pressed
					checkReady(player2, player, "low-kick");
					break;
				default:
					// If an incorrect key is pressed then remove it from the action box
					$("#p2-attacks").val($("#p2-attacks").val().substr(0, $("#p2-attacks").val().length - 1));
			}
		}
	}
});

// Check if players are ready to fight
// ----------------------------------------------------------------------
function checkReady(playerObject, playerEl, action) {
	// Check to see if the player has hit their total
	// number of allowed actions. If not, then we'll
	// go ahead and add this action to their actions
	if(playerObject.actions.length < actionCount) {
		console.log(playerObject.name + " added a " + action);
		playerObject.actions.push(action);
	}
	
	// If the player has reached their total number of
	// actions we'll want to disable them from adding
	// anymore, and set them as ready to fight
	if(playerObject.actions.length == actionCount) {
		console.log(playerObject.name + " has been cut off from adding moves");
		// Clear the current player action box, disable it and set a placeholder of "Ready!".
		// We're stripping the "#" from playerEl since either "#player-1" or "#player-2" was passed in
		$(".action-box[data-player='" + playerEl.replace("#", "") + "']").attr("disabled", "disabled").val("").attr("placeholder", "Ready!");

		// Set the current player as ready
		playerObject.ready = true;
		
		// If playing against the AI and the player is ready then set the
		// AI's selected moves
		if(computer == "true")
		{
			// Only set as many moves as there are actions. Randomly selected
			// from the cpuArray defined at the top of this document
			for(var i=0; i<actionCount; i++)
			{
				var key = Math.floor(Math.random() * 3);
				player2.actions.push(cpuArray[key]);
				$(".action-box[data-player='player-2']").attr("placeholder", "Ready!");
				console.log("CPU added a " + cpuArray[key]);
			}

			// Set the CPU as ready
			player2.ready = true;
		}
	}
	
	// Begin the current round of fighting
	commence(player1.ready, player2.ready);
}

// If both players are ready, begin fighting
// ----------------------------------------------------------------------
function commence(p1, p2) {
	// Check if both players are ready to fight, if
	// they aren't, then we return. If they are, then
	// we'll begin fighting
	if(p1 == false || p2 == false) {
		return;
	}
	else {
		// Here we'll want to wait a few seconds before we begin. We 
		// don't want the action to happen instantly after the last 
		// player chooses their last action. The strikePause variable 
		// sets the delay
		setTimeout(function()
		{
			console.log("Starting Round 1");
			// Grab the first action from both players and calculate
			// who wins
			var p1Action = player1.actions[0].toString();
			var p2Action = player2.actions[0].toString();
			calculateAttack(p1Action, p2Action);
			
			// Check to see if there are two actions that
			// will happen. If so, then we'll proceed to
			// the next moves. We'll also check if a player
			// has been defeated. If they are, then we'll 
			// skip to the finishing animations
			if(player1.dead == false && player2.dead == false)
			{
				if(actionCount >= 2)
				{
					// Use strikePause to set a slight attack delay
					setTimeout(function()
					{
						console.log("Starting Round 2");
						var p1Action = player1.actions[1].toString();
						var p2Action = player2.actions[1].toString();
						
						// Check to see if either player is currently blocking. Since stamina
						// can be no less than 1 we can only be blocking in rounds 2 and 3
						checkForBlocking(p1Action, p2Action);
						
						// Check to see if there is a third action that
						// will happen. If so, then we'll continue fighting
						//  We'll also check if a player has been defeated. 
						// If they are, then we'll skip to the finishing animations
						if(player1.dead == false && player2.dead == false)
						{
							if(actionCount == 3)
							{
								setTimeout(function()
								{
									console.log("Starting Round 3");
									var p1Action = player1.actions[2].toString();
									var p2Action = player2.actions[2].toString();
									
									checkForBlocking(p1Action, p2Action);
									
									if(player1.dead == false && player2.dead == false)
									{
										console.log("Resetting after round 3 for next fight");
										// If neither player died then reset for the next round
										resetForNextRound();
									}
									else
									{
										// Check to see who died and play their finishing animation
										player1.dead == true ? endGame("player1") : endGame("player2");
									}
								}, strikePause);
							}
							else
							{
								// If we're done fighting then we'll reset
								// our stats for the next round
								console.log("Resetting after round 2 for next fight");
								resetForNextRound();
							}
						}
						else
						{
							// Check to see who died and play their finishing animation
							player1.dead == true ? endGame("player1") : endGame("player2");
						}
					}, strikePause);
				}
				else
				{
					// If we're done fighting then we'll reset
					// our stats for the next round
					console.log("Resetting after round 1 for next fight");
					resetForNextRound();
				}
			}
			else
			{
				// Check to see who died and play their finishing animation
				player1.dead == true ? endGame("player1") : endGame("player2");
			}
		}, strikePause);
	}
}

// End the game
// ----------------------------------------------------------------------
function endGame(player) {
	// Check who lost and show the correct winner name, winner animation and loser animation
	if(player == "player1") {
		setTimeout(function(){$("#player-1").children(".player").children("img").attr("src", player1.name + "/lose.gif")}, finishTime);
		setTimeout(function(){$("#player-2").children(".player").children("img").attr("src", player2.name + "/win.gif")}, finishTime);
		$("#notification-box").children("p").hide();
		$("#" + player2.short + "-wins").fadeIn("fast");
		$("#player1-meter .health-bar").css("width", 0);
	}
	else {
		setTimeout(function(){$("#player-1").children(".player").children("img").attr("src", player1.name + "/win.gif")}, finishTime);
		setTimeout(function(){$("#player-2").children(".player").children("img").attr("src", player2.name + "/lose.gif")}, finishTime);
		$("#notification-box").children("p").hide();
		$("#" + player1.short + "-wins").fadeIn("fast");
		$("#player2-meter .health-bar").css("width", 0);
	}
}

// Check to see if either player is blocking
// ----------------------------------------------------------------------
function checkForBlocking(p1Action, p2Action) {
	// Since the player with the most stamina will set the current actionCount we
	// need to see which ones has less or if they're equal. If one has less stamina then
	// we'll set up which block they chose. (i.e. punch-blocking, low-lick-blocking, high-kick-blocking)
	if(player1.liveStamina < actionCount) {
		setBlocks("player1", p1Action, p2Action);
	}
	else if(player2.liveStamina < actionCount) {
		setBlocks("player2", p1Action, p2Action);
	}
	else {
		calculateAttack(p1Action, p2Action);
	}
}

// Set the blocks for the current player
// ----------------------------------------------------------------------
function setBlocks(player, p1Action, p2Action) {
	// If a player is blocking set which move they used to block. (i.e. If they chose
	// punch and have less stamina then we'll set it to punch-blocking). This will 
	// tell us which animations to play when calculating the attack.
	if(player == "player1") {
		p1Action += "-blocking";
		console.log("Player 1 action is " + p1Action);
	}
	else {
		p2Action += "-blocking";
		console.log("Player 2 action is " + p2Action);
	}
	calculateAttack(p1Action, p2Action);
}

// Calculate moves to see who hits/misses
// ----------------------------------------------------------------------
function calculateAttack(p1action, p2action) {
	var player1El = "#player-1", player2El = "#player-2";
	
	// Here we'll see what action player1 chose and
	// compare it to player two's action
	switch(p1action) {
		// If player 1 chose to punch, then we'll run through all of the possible scenarios
		// to see who won, set the correct aniations and do the correct data processing.
		// We'll do this for all 3 attacks and all 3 blocks
		case "punch":
			switch(p2action)
			{
				case "low-kick": // Player 2 wins
					// In this case we would change player 1's gif image to muay-thai-mark/low-kicked.gif
					action(player1El, player1.name, p2action + "ed"); 
					// In this case we would change player 1's gif image to kung-fu-kirk/low-kick.gif
					action(player2El, player2.name, p2action);
					// We would then do all of the necessary data processing for player 2 winning
					winnerIs("player2");
					break;
				case "high-kick": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
				case "punch":
				case "punch-blocking":
					showMessege("#draw");
					break;
				case "low-kick-blocking": // Player 2 wins and dodges
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, "high-dodge");
					dodgerIs("player2");
					break;
				case "high-kick-blocking": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
			}
			break;
		case "low-kick":
			switch(p2action)
			{
				case "low-kick":
				case "low-kick-blocking":
					showMessege("#draw");
					break;
				case "high-kick": // Player 2 wins
					action(player1El, player1.name, p2action + "ed");
					action(player2El, player2.name, p2action);
					winnerIs("player2");
					break;
				case "punch": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
				case "high-kick-blocking": // Player 2 wins and dodges
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, "low-dodge");
					dodgerIs("player2");
					break;
				case "punch-blocking": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
			}
			break;
		case "high-kick":
			switch(p2action)
			{
				case "low-kick": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
				case "high-kick":
				case "high-kick-blocking":
					showMessege("#draw");
					break;
				case "punch": // Player 2 wins
					action(player1El, player1.name, p2action + "ed");
					action(player2El, player2.name, p2action);
					winnerIs("player2");
					break;
				case "low-kick-blocking": // Player 1 wins
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, p1action + "ed");
					winnerIs("player1");
					break;
				case "punch-blocking": // Player 2 wins and dodges
					action(player1El, player1.name, p1action);
					action(player2El, player2.name, "high-dodge");
					dodgerIs("player2");
					break;
			}
			break;
		case "punch-blocking":
			switch(p2action)
			{
				case "low-kick": // Player 2 wins
					action(player1El, player1.name, p2action + "ed");
					action(player2El, player2.name, p2action);
					winnerIs("player2");
					break;
				case "high-kick": // Player 1 wins and dodges
					action(player1El, player1.name, "high-dodge");
					action(player2El, player2.name, p2action);
					dodgerIs("player1");
					break;
				case "punch":
					showMessege("#draw");
					break;
			}
			break;
		case "low-kick-blocking":
			switch(p2action)
			{
				case "low-kick":
					showMessege("#draw");
					break;
				case "high-kick": // Player 2 wins
					action(player1El, player1.name, p2action + "ed");
					action(player2El, player2.name, p2action);
					winnerIs("player2");
					break;
				case "punch": // Player 1 wins and dodges
					action(player1El, player1.name, "high-dodge");
					action(player2El, player2.name, p2action);
					dodgerIs("player1");
					break;
			}
			break;
		case "high-kick-blocking":
			switch(p2action)
			{
				case "low-kick": // Player 1 wins and dodges
					action(player1El, player1.name, "low-dodge");
					action(player2El, player2.name, p2action);
					dodgerIs("player1");
					break;
				case "high-kick":
					showMessege("#draw");
					break;
				case "punch": // Player 2 wins
					action(player1El, player1.name, p2action + "ed");
					action(player2El, player2.name, p2action);
					winnerIs("player2");
					break;
			}
			break;
	}
}

// Set stamina
// ----------------------------------------------------------------------
function setStamina(player, field, type) {
	if(type == "add") {
		// If the player already has 3 stamina points they're at their max so leave it at 3
		player.stamina < 3 ? player.stamina++ : player.stamina = 3;
		console.log(player.name + "'s stamina has increased and been set to " + player.stamina);
	}
	else if(type == "subtract") {
		// If the player already has 1 stamina points they're at their minimum so leave it at 1
		player.stamina > 1 ? player.stamina-- : player.stamina = 1;
		console.log(player.name + "'s stamina has decreased and been set to " + player.stamina);
	}
	// Set the new action count for the next round
	setActionCount();
}

// Set Action Count
// ----------------------------------------------------------------------
function setActionCount() {
	if(player1.stamina > player2.stamina) {
		console.log("Setting actionCount to player1.stamin");
		actionCountTemp = player1.stamina;
	}
	else if(player1.stamina < player2.stamina) {
		console.log("Setting actionCount to player2.stamin");
		actionCountTemp = player2.stamina;
	}
	else {
		actionCountTemp = player1.stamina;
	}
	console.log("actionCount = " + actionCount);
}

// Set stamina, health and dead flag for winner and loser
// ----------------------------------------------------------------------
function winnerIs(player) {
	console.log(player == "player1" ? "Player 1 wins" : "Player 2 wins");
	showMessege(player == "player1" ? "#" + player1.short + "-hits" : "#" + player2.short + "-hits");
	if(player == "player1") {
		setStamina(player1, "player-1-stamina", "add");
		setStamina(player2, "player-2-stamina", "subtract");
	} else {
		setStamina(player1, "player-1-stamina", "subtract");
		setStamina(player2, "player-2-stamina", "add");		
	}
	player == "player1" ? decreaseHealth(player2, "player2") : decreaseHealth(player1, "player1");
	$("#player-1-health").html(player1.health);
	$("#player-2-health").html(player2.health);
	if(player == "player1" && player2.health == 0) {
		player2.dead = true;
	} else if(player1.health == 0) {
		player1.dead = true;
	}
}

// Set stamina for winner and loser and play dodge animation
// ----------------------------------------------------------------------
function dodgerIs(player) {
	if(player == "player1") {
		showMessege("#" + player1.short + "-dodges");
		setStamina(player2, "player-2-stamina", "subtract");
	} else {
		showMessege("#" + player2.short + "-dodges");
		setStamina(player1, "player-1-stamina", "subtract");
	}
}

// Decrease the health of the specified player
// ----------------------------------------------------------------------
function decreaseHealth(playerObject, player) {
	playerObject.health--;
	setTimeout(function(){showRed();}, 200);
}

// Clear the action arrays for both players
// ----------------------------------------------------------------------
function clearActions() {
	player1.actions = [];
	player2.actions = [];
}

// Show red when a player is hit
// ----------------------------------------------------------------------
function showRed() {
	$("#hit-notifier").show();
	$("#hit-notifier").fadeOut();
}

// Show a messege for whoever wins, hits or dodges
// ----------------------------------------------------------------------
function showMessege(el) {
	$(el).fadeIn("fast", function() {
		setTimeout(function()
		{
			$(el).fadeOut("slow");
		}, 2500);
	});
}

// Check the life bar levels and set them to the correct colors
// ----------------------------------------------------------------------
function checkLifeBars() {
	$(".health-bar").each(function() {
		// Change pixel width to percent
		// 396 is the max pixel width of the life bar
		var life = Math.round(($(this).width() / 396) * 100);
		if(life < 20)
		{
			// Set life bar to yellow
			$(this).css("background", "#FF5656");
		}
		else if(life <= 40 && life >= 20)
		{
			// Set life bar to red
			$(this).css("background", "#E8FF00");
		}
	});
}

// Reset stats for next round of fighting
// ----------------------------------------------------------------------
function resetForNextRound() {
	setTimeout(function() {
		player1.ready = false;
		player2.ready = false;
		clearActions();
		init(player1, player2);
	}, strikePause);
}

// Preload GIFs for successful animation display
// ----------------------------------------------------------------------
var img1 = new Image(); img1.src = player1.name + "/high-dodge.gif";
var img2 = new Image(); img2.src = player1.name + "/win.gif";
var img3 = new Image(); img3.src = player1.name + "/high-kick.gif";
var img4 = new Image(); img4.src = player1.name + "/high-kicked.gif";
var img5 = new Image(); img5.src = player1.name + "/lose.gif";
var img6 = new Image(); img6.src = player1.name + "/low-dodge.gif";
var img7 = new Image(); img7.src = player1.name + "/low-kick.gif";
var img8 = new Image(); img8.src = player1.name + "/low-kicked.gif";
var img9 = new Image(); img9.src = player1.name + "/punch.gif";
var img10 = new Image(); img10.src = player1.name + "/punched.gif";
var img11 = new Image(); img11.src = player1.name + "/stance.gif";
var img12 = new Image(); img12.src = player2.name + "/high-dodge.gif";
var img13 = new Image(); img13.src = player2.name + "/win.gif";
var img14 = new Image(); img14.src = player2.name + "/high-kick.gif";
var img15 = new Image(); img15.src = player2.name + "/high-kicked.gif";
var img16 = new Image(); img16.src = player2.name + "/lose.gif";
var img17 = new Image(); img17.src = player2.name + "/low-dodge.gif";
var img18 = new Image(); img18.src = player2.name + "/low-kick.gif";
var img19 = new Image(); img19.src = player2.name + "/low-kicked.gif";
var img20 = new Image(); img20.src = player2.name + "/punch.gif";
var img21 = new Image(); img21.src = player2.name + "/punched.gif";
var img22 = new Image(); img22.src = player2.name + "/stance.gif";