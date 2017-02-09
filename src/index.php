<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Electronic Thesis and Disertations</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="public/css/style.css">

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script type="text/javascript" src="public/js/main.js"></script>
</head>

<body>

<div>
    <?php
        require_once('./resources/config.php');
        require_once(TEMPLATES_PATH . '/header.php')
    ?>
</div>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-2 file-select-region">
            <?php
                require_once(TEMPLATES_PATH . '/file-select.php');
            ?>
        </div>
        <div class="col-md-5 xml-view-region">
            <?php
                require_once(TEMPLATES_PATH . '/xml-view.php');
            ?> 
        </div>
        <div class="col-md-5 xml-edit-region">
            <?php
                require_once(TEMPLATES_PATH . '/xml-edit.php');
            ?>
        </div>
    </div>
</div>

</body>

</html>
