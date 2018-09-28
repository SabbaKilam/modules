<?php

    //remove the named file from the uploads directory
    $filename = file_get_contents("php://input");
    $fullpath = getcwd() . "/../uploads/" . $filename;
    unlink($fullpath);
    exit($fullpath);

?>