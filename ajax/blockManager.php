<?php

require_once("../library/functions.php");

$blocks = db_select("SELECT * FROM blocks");

echo json_encode($blocks);

?>