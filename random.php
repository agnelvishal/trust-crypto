<?php
header('Content-type: application/json');
$value = rand(0,1) == 1;
$array=array('random' => $value);
echo json_encode($array);

?>
a