<?php
Header("content-type: application/x-javascript");

$list = array (
  "DomGenerator",
  "Cookie",
  "DomUtils",
  "Callbacks",
  "NamedItemList",
  "PopupWindow",
  "ServerComm",
  "Logger",
  "RemoteStorage",
  "JsSnippetEditor"
   );
   
 $path="http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI']) . '/';
   ?>

(function (){
var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.type = 'text/css';
link.href = "<?=$path?>resources/PopupWindow.css";
document.body.appendChild(link);
})();

<?php
foreach ($list as $name) {
  readfile ($name . ".js");
  }
?>

(function (){
new JsSnippetEditor(["<?=$_REQUEST['user']?>", "<?=$_REQUEST['pw']?>", "<?=$_REQUEST['group']?>", "<?=$path?>remotestore.php"]);
})();