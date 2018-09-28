<?php

    $contents = $_POST["contents"];
    $filename = $_POST["filename"];
    file_put_contents("../" . $filename, $contents);

    exit("Saved model named " .  $filename);
?>