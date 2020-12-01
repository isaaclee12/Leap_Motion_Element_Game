<!DOCTYPE html>

<html>

<head>

    <!--numjs-->
    <script src="https://cdn.jsdelivr.net/gh/nicolaspanel/numjs@0.15.1/dist/numjs.min.js"></script>
    <!--ml5-->
    <script src="https://unpkg.com/ml5@0.4.3/dist/ml5.min.js"></script>
    <!--Leap-->
    <script type="text/javascript" src="http://js.leapmotion.com/leap-0.6.3.min.js"></script>
    <!--npm-->
    <script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
    <!--JQuery-->
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <!--main-->
    <script src="PredictGestures.js"></script>
    <!--draw space-->
    <script src="prepareToDraw.js"></script>

    <!--Tests-->

    <script src="datasets/airSign1.js"></script>
    <script src="datasets/airSign2.js"></script>
    <script src="datasets/airSign3.js"></script>
    <script src="datasets/airSign4.js"></script>
    <script src="datasets/airSign5.js"></script>
    <script src="datasets/airSign6.js"></script>

    <script src="datasets/fireSign1.js"></script>
    <script src="datasets/fireSign2.js"></script>
    <script src="datasets/fireSign3.js"></script>
    <script src="datasets/fireSign4.js"></script>
    <script src="datasets/fireSign5.js"></script>
    <script src="datasets/fireSign6.js"></script>

    <script src="datasets/waterSign1.js"></script>
    <script src="datasets/waterSign2.js"></script>
    <script src="datasets/waterSign3.js"></script>
    <script src="datasets/waterSign4.js"></script>
    <script src="datasets/waterSign5.js"></script>
    <script src="datasets/waterSign6.js"></script>



</head>

<body onload="DisplayList()">
<main>
    <?php

    //console_log function https://stackify.com/how-to-log-to-console-in-php/
    function console_log($output, $with_script_tags = true) {
        $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) .
            ');';
        if ($with_script_tags) {
            $js_code = '<script>' . $js_code . '</script>';
        }
        echo $js_code;
    }

    /*print '<p>POST Array:</p><pre>';
    print_r($_POST);
    print '</pre>';*/



    //process form when it is submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        //VARS
        $dataIsClean = true;

        //Sanitize data
        $username = filter_var($_POST["f_username"], FILTER_SANITIZE_STRING);
        $score = $_POST["f_score"];//filter_var(, FILTER_SANITIZE_INT);

        //SERVER SIDE VALIDATION
        if ($username == "") {
            print '<p class="error">Please enter your username.</p>';
            $dataIsClean = false;
        }

        if (empty($username)) {
            print '<p class="error">Username Empty.</p>';
            $dataIsClean = false;
        }

        //print
        //print '<p>Username: ' . $username . '</p>';

        //data to file
        //If data clean,
        if ($dataIsClean) {

            //Establish var for duplicateFound
            $duplicateFound = false;



            /*https://www.w3schools.com/php/func_filesystem_readfile.asp*/

            //Read file
            $usernameList = file_get_contents("usernames.txt");
            //print_r($usernameList);
            //print '<p></p>';



            //Make into list
            $usernameList = preg_split("/\s+/", $usernameList, -1, PREG_SPLIT_NO_EMPTY);
            //print_r($usernameList);


            //Search list
            /*echo '<p>SEARCHING:</p>';
            print_r($username);
            echo '<p>IN LIST:</p>';
            print_r($usernameList);*/

            //"\n" .
            $usernameWithScore = $username . ":0";

            //If username in array
            if (array_search($usernameWithScore, $usernameList) !== false) {
                //Match found.
                echo '<p>Username already entered.</p>';
                $duplicateFound = true;
            }

            //If not in array
            else {
                echo '<p>Adding new user:' . $usernameWithScore . '</p>';
                echo '<br><br>';
            }

            /*//Scan list for stuff
            for ($i = 0; $i < count($usernameList); $i++) {

                print_r($usernameList[$i]);
                print_r($username);
                echo '<br>';

                //If match found
                if ($usernameList[$i] === $username) {
                    echo '<p>FOUND MATCH</p>';
                    $duplicateFound = true;
                }
            }*/

            //If match was found, overwrite score
            if ($duplicateFound) {
                //console_log("Duplicate Found, cannot write.");

                //Attempt to open file
                @ $fp = fopen("usernames.txt", 'a');

                //On fail
                if (!$fp) {
                    echo '<p><strong>Cannot generate message file</strong></p></body></html>';
                    exit;
                }

                //On success
                else {

                    //Add newline and score
                    $line = "\n" . $username . ":" . $score;

                    //write username to file
                    fwrite($fp, $line);
                    print '<p>line added to file: ' . $line . '</p>';
                }

            }

            //No match found
            else {
                //Write to file

                //Attempt to open file
                @ $fp = fopen("usernames.txt", 'a');

                //On fail
                if (!$fp) {
                    echo '<p><strong>Cannot generate message file</strong></p></body></html>';
                    exit;
                }

                //On success
                else {

                    //Add newline and score
                    $username = "\n" . $username . ":0";

                    //write username to file
                    fwrite($fp, $username);
                    print '<p>Username added to file: ' . $username . '</p>';
                }
            }
        }
    }
    ?>
    <!--PREVENT REFRESH ON SUBMIT-->
    <!--https://stackoverflow.com/questions/23507608/form-submission-without-page-refresh-->
    <script type="text/javascript">
        $(document).ready(function () {
            $('#myform').on('submit', function(e) {
                e.preventDefault();
                $.ajax({
                    url : $(this).attr('action') || window.location.pathname,
                    type: "POST",
                    data: $(this).serialize(),
                    success: function (data) {
                        $("#form_output").html(data);
                    },
                    error: function (jXHR, textStatus, errorThrown) {
                        alert(errorThrown);
                    }
                });
            });
        });
    </script>

    <form id="myform" method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>">
        Enter Userame: <input id="username" type="text" name="f_username" placeholder="name">
        <input onclick="return SignIn();" type="submit">
        <!--<button onclick="return SignIn();" id="button" type="submit">Sign in</button>-->
    </form>
</main>

<ul id="users" style = "color:black">
    <!--<li>user1</li>-->
</ul>

</body>
</html>