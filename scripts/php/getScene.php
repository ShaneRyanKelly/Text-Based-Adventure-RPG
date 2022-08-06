<?php
    $filePath = $_GET['scene'];
    $scene = fopen($filePath, "r") or die("Unable to find Scene");
    echo fread($scene, filesize($filePath));
    fclose($scene);
?>