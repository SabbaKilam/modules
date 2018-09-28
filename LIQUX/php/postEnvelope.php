<?php
  //first, reduce file upload restrictions
  ini_set("file_uploads", "On");    
  ini_set("memory_limit", "512M");
  ini_set("upload_max_filesize", "50M");
  ini_set("post_max_size", "100M");
  ini_set("max_execution_time", "60");

	$filename = $_POST["filename"];
	$contents = file_get_contents($_POST["contents"]);
	file_put_contents("../uploads/" . $filename, $contents );

?>