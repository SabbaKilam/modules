<?php
    
    $folder = "../playlists/";
    $filename = "playlists.json";
    $contents = file_get_contents("php://input");
    file_put_contents($folder . $filename, $contents);

?>