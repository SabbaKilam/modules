<?php

    session_start();
    
    $_SESSION["accessLevel"] = "deny";
    
    $PASSWORD  = "b5a796ddf8ce39bc779d58a7844d83f8";
    
    if ( md5($_POST["password"]) === $PASSWORD ){
        
         $_SESSION["accessLevel"] = "allow";
    }
    
    exit( $_SESSION["accessLevel"]);
    
?>