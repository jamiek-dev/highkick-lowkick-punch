<?php
// require_once('session.php');
// if($_GET["password"] == "rpst3sting")
// {
// 	$_SESSION["id"] = "loggedIn";
// 	header("Location: http://www.jamie-k.com/side-projects/rock-paper-scissors/high-kick-low-kick-punch.php?cpu={$_GET['cpu']}&health={$_GET['health']}");
// }
// else
// {
// 	unset($_SESSION["id"]);
// 	$message = "Please enter the correct password";
// }
if(isset($_POST["submit"])) {
  header("Location: http://www.jamie-k.com/side-projects/rock-paper-scissors/high-kick-low-kick-punch.php?cpu={$_GET['cpu']}&health={$_GET['health']}");
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Menu</title>
<link href='http://fonts.googleapis.com/css?family=Rokkitt:400,700' rel='stylesheet' type='text/css'>
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>

<body>
  <div id="container" class="home-container">
    <h1>Please select your opponent and health.</h1>
    <form name="options" id="options" method="get" action="high-kick-low-kick-punch.php">
      Opponent: <select name="cpu">
        <option value="true">Computer</option>
        <option value="false">Human</option>
      </select>
      Starting Health: <select name="health">
        <option name="" value="1">10%</option>
        <option name="" value="2">20%</option>
        <option name="" value="3">30%</option>
        <option name="" value="4">40%</option>
        <option name="" value="5">50%</option>
        <option name="" value="6">60%</option>
        <option name="" value="7">70%</option>
        <option name="" value="8">80%</option>
        <option name="" value="9">90%</option>
        <option name="" value="10">100%</option>
      </select><br />
      <?php if(isset($message)){echo "<p class='red-text'>".$message."</p>";} ?>
      <!-- <p>Password:
      <input type="text" name="password" id="password" value="" /></p> -->
      <p>This game is played just like Rock, Paper, Scissors, but with the additon of stamina and combos.<br /> 
    Please select your opponent and starting health to continue.</p>
    </form>
    <input type="submit" name="submit" id="submit" value="Submit" onClick="document.getElementById('options').submit();" />
    
  </div>
</body>
</html>
