<?php

	$songList = "";
	$songsArray = scandir("../uploads");
	foreach($songsArray as $song){
		if ( strtolower(substr($song, -4)) === ".mp3") {
		//if($song != "."  && $song != ".." && $song != "index.html" && $song != "index.php"){
			$songList .=  $song . "\n";
		}
	}
	$songlist = rtrim($songList);
	exit($songList);
?>


