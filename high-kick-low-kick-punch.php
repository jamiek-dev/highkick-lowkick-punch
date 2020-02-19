<?php
// require_once('session.php');
// confirm_logged_in();
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>High Kick, Low Kick, Punch</title>
<script src="js/setup.js"></script>
<link href='http://fonts.googleapis.com/css?family=Rokkitt:400,700' rel='stylesheet' type='text/css'>
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div id="hit-notifier"></div>
<div id="container">
  
  <!-- Life Bars -->
  <div class="box clearfix">
    <div id="player1-meter" class="life-meter">
    	<div class="health-bar"><span>Muay Thai Mark</span></div>
      <div class="clear-float"></div>
      <p>Stamina<span></span></p>
    </div>
    
    <div id="actions-box">
    	<div>Actions</div>
      <div id="action-count">1</div>
    </div>
    
    <div id="player2-meter" class="life-meter">
    	<div class="health-bar"><span>Kung Fu Kirk</span></div>
      <div class="clear-float"></div>
      <p><span></span>Stamina</p>
    </div>
  </div>
  <!-- // Life Bars -->
  
  <!-- Fight notifications -->
  <div id="notification-box">
  	<p id="kfk-wins">Kung Fu Kirk <span>Wins!</span></p>
    <p id="kfk-dodges">Kung Fu Kirk <span>Dodges</span></p>
    <p id="kfk-hits">Kung Fu Kirk <span>Hits</span></p>
    <p id="mtm-wins">Muay Thai Mark <span>Wins!</span></p>
    <p id="mtm-dodges">Muay Thai Mark <span>Dodges</span></p>
    <p id="mtm-hits">Muay Thai Mark <span>Hits</span></p>
    <p id="draw"><span>Draw</span></p>
  </div>
  <!-- // Fight notifications -->
    
  <div class="clearfix">
    <div id="player-1" class="player-box">
    	<div id="p1-actions">
      	Player 1 Actions:<br />
        A - Punch<br />
        S - High Kick<br />
        D - Low Kick<br /><br />
      	<input type="password" class="action-box" name="p1-attacks" id="p1-attacks" data-player="player-1" />
      </div>
      <div class="player">
        <img src="muay-thai-mark/stance.gif" alt="" />
      </div>
    </div>
    
    <div id="player-2" class="player-box">
    	<div id="p2-actions">
      	Player 2 Actions:<br />
        J - Punch<br />
        K - High Kick<br />
        L - Low Kick<br /><br />
      	<input type="password" class="action-box" name="p2-attacks" id="p2-attacks" data-player="player-2" />
      </div>
      <div class="player">
        <img src="kung-fu-kirk/stance.gif" alt="" />
      </div>
    </div>
  </div>
  
  <div id="desctiptions">
    <div class="desc"><img src="images/desc-actions.png" /></div>
    <div class="desc"><img src="images/desc-health.png" /></div>
    <div class="desc"><img src="images/desc-move-fields.png" /></div>
    <div class="desc"><img src="images/desc-moves.png" /></div>
    <div class="desc"><img src="images/desc-stamina.png" /></div>
    <div class="desc"><img src="images/show-help.png" /></div>
    <div class="desc"><img src="images/hide-help.png" /></div>
  </div>
  
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="js/functions.js"></script>


</body>
</html>
