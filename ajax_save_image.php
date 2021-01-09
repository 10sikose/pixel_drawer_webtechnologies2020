<?php 

include 'db/connect.class.php';
$connection = new mySQL();

//$received = $GLOBALS['HTTP_RAW_POST_DATA']; version 5.6.10
$received = file_get_contents("php://input"); // version php 7
$received = explode("---",$received);
$image_name = $received[1];
$image_data = $received[0];

$query = "SELECT `id`,`image_name` FROM `data` WHERE `image_name` = '".$image_name."'";
$query_run = $connection->queryRun($query);
$dataObj = mysqli_fetch_object($query_run);
if($dataObj){
	echo 'An image is already saved under this name. Please try another name.';
}else{
	// Path where the image is going to be saved
	$filePath = 'saved_images/'.$image_name.'.png';
	$query = "INSERT INTO `data` SET `image_name` = '".$image_name."',
									 `image_data` = '".$image_data."',
									 `image_url` = '".$filePath."'";
	$query_run = $connection->queryRun($query);
	
	$encodedData = $image_data;
	$imgData = str_replace(' ','+',$encodedData);
	$imgData =  substr($imgData,strpos($imgData,",")+1);
	$imgData = base64_decode($imgData);
	// Write $imgData into the image file
	$file = fopen($filePath, 'w');
	fwrite($file, $imgData);
	fclose($file);
	
	echo 'Image Saved Successfully!';
}


?>
