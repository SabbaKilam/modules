<?php
    session_start();
    
    $_SESSION["accessLevel"] = "deny";
    exit($_SESSION["accessLevel"]);
?>