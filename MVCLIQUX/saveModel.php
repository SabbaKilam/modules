<?php
    $filename = $_SERVER[HTTP_FILENAME];
    $contents = file_get_contents("php://input");
    file_put_contents($filename, $contents);
?>