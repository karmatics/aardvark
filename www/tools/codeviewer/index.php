<html>
<link href="prettifyCode.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../../js/wmi_shared.js"></script>
<script type="text/javascript" src="prettify.js"></script>
<script type="text/javascript" src="prettifyMyEnhancements.js"></script>
<script type="text/javascript">
PrettyCode.splitString = "<br>";


function promptForPassword () {
  var enteredPassword = prompt ("enter password to view code:");
  CookieUtils.set ("codeviewauth", enteredPassword, 180);
  window.location.reload();
  }
</script>

<?php
$doIt = false;
$pass = '';
if(isset($_COOKIE['codeviewauth'])) {
  $pass = $_COOKIE['codeviewauth'];
  }
if ($pass == "zyziphus")
  $doIt = true;
else {

  echo "<script>promptForPassword();</script>\n";
  }
?>

<body>

<input type="checkbox" onchange="PrettyCode.checkboxChanged()" id="linenocheckbox"> hide line numbers<br><br>
<div id="codediv"></div>
<textarea id="hiddenta" style="display: none">
<?php
if ($doIt) {
  $file = $_REQUEST['file'];
  $file = str_replace("..", "", $file);
  if ($file{0} == '/')
    $file = '';
  echo str_replace("<", "&lt;", file_get_contents("../../" . $file));
  }
?>
</textarea>
 </body>
 <script>
 PrettyCode.insertCode (document.getElementById('hiddenta').value, null, {elemId: 'codediv'});
  </script>
</html>
