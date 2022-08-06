<?php
    require("./connectDB.php");
    $sql = "SELECT * FROM character_data";
    $result = $connection->query($sql);
    $row = $result->fetch_assoc();
    $connection->close();
    echo json_encode($row);
?>