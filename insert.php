<?php

 
 $txnHash = htmlspecialchars($_GET['txnHash']);
$input= htmlspecialchars($_GET['input']);
$output = htmlspecialchars($_GET['output']);

$link = mysqli_connect('localhost', 'root', '');
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = sprintf("insert into trust txnHash, input, output values('%s','%d','%d')",
            mysql_real_escape_string($txnHash),
            $input,
            $output
        );

?>
