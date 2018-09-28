<?php
    session_start();
    exit(md5($_POST["password"]));

?>