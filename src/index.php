<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Electronic Theses and Dissertations</title>

    <!-- JQuery -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

    <!-- Bootstrap & Font Awsome -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="public/css/style.min.css">

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js" type="text/javascript"></script>
    <script src="app/app.module.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="public/js/bundle.min.js"></script>
</head>

<body>

<div>
    <?php
        require_once('./resources/config.php');
        require(TEMPLATES_PATH . '/header-template.min.html');
    ?>

</div>

<!-- get sibboleth identikey attribute into JS variable -->
<script type="text/javascript">
    var identikey = "<?php echo $config['uid'] ?>";
</script>

<div class="container-fluid">
    <div class="row match-my-cols">
        <!-- Sidebar -->
        <div class="col-md-2 file-select-region">
            <?php require(TEMPLATES_PATH . '/sidebar-nav-template.min.html'); ?>
        </div>
        <!-- View -->
        <div class="col-md-5 xml-view-region">
            <?php require(TEMPLATES_PATH . '/xml-view-template.min.html'); ?>
        </div>
        <!-- edit -->
        <div class="col-md-5 xml-edit-region">
            <?php require(TEMPLATES_PATH . '/xml-edit-template.min.html'); ?>
        </div>
    </div>
</div>


<div ng-app="searchApp">
    <div id="dialog" title="Disciplines Search">
        <discipline-search></discipline-search>
    </div>
</div>

</body>

</html>
