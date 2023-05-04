<?php

require_once("library/functions.php");

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/css/style.css">
    <script defer src="./js/functions.js"></script>
    <script defer src="./js/classes/Block.js"></script>
    <script defer src="./js/classes/Builder.js"></script>
    <script defer src="./js/index.js"></script>
    <title>Isometric Builder</title>
</head>
<body>
    <main>
        <div class="panel-left">
            <div id="canvas-container" class="canvas-container">
                <div id="canvas-wrapper" class="wrapper">
                    <canvas id="canvas-builder"></canvas>
                </div>
            </div>
            <div class="btns-container">
                <div class="left">
                    <div class="btn-container">
                        <label for="input-zoom">Zoom</label>
                        <input id="input-zoom" name="input-zoom" type="range" value="1" min ="0.25" max="3" step="0.01" onInput="builder.update()">
                    </div>
                    <div class="btn-container">
                        <label for="input-active-layer">Active Layer</label>
                        <input id="input-active-layer" name="input-active-layer" type="range" value="0" min ="0" step="1" onInput="builder.update()">
                    </div>
                </div>
                <div class="right">
                    <div class="btn-container">
                        <div id="input-view-mode" onclick="builder.switchViewMode()"><img id="input-view-mode-icon" src="assets/icons/eye.svg"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-right">
        </div>

    </main>
</body>
</html>