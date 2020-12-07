<!DOCTYPE html>

<html>

<head>

    <!--numjs-->
    <script src="https://cdn.jsdelivr.net/gh/nicolaspanel/numjs@0.15.1/dist/numjs.min.js"></script>
    <!--ml5-->
    <script src="https://unpkg.com/ml5@0.4.3/dist/ml5.min.js"></script>
    <!--Leap Motion-->
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
    <script>WriteScoreToFile()</script>
<!--    <input type="hidden" id="score" value="--><?php //echo $score ?><!--" />-->
<!--    <ul id="score"></ul>-->
<!--    <div id="score"></div>-->
    <form id="score" method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>"></form>

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

        /*
         * GET USERNAME FROM FORM
         * */
        //VARS
        $dataIsClean = true;

        //Sanitize data
        $username = filter_var($_POST["f_username"], FILTER_SANITIZE_STRING);

        //SERVER SIDE VALIDATION
        if ($username == "") {
            print '<p class="error">Please enter your username.</p>';
            $dataIsClean = false;
        }

        if (empty($username)) {
            print '<p class="error">Username Empty.</p>';
            $dataIsClean = false;
        }

        /*
         * ADD USERNAME TO FILE
         * */
        //If data clean,
        if ($dataIsClean) {

            //Acquire score from .js
            $totalScore = $_COOKIE["total_score"]; //filter_var($_POST["f_score"], FILTER_SANITIZE_STRING);
            print '<p> SCORE: ' . $totalScore . '</p>';

            /*
             * READ HIGH SCORES FILE FOR DATA
             * */
            //Read file
            $highScoresList = file_get_contents("highscores.txt");

            //Split list into items by space
            $highScoresList = preg_split("/[:\s]+/", $highScoresList, -1, PREG_SPLIT_NO_EMPTY);

            //Init new array and index
            $highScoresDict = array();
            //$index = 0;
            $usernameIndexInScoresList = 0;
            $lastScore = "";

            //For all items in that array of Names/Scores
            for ($i = 0; $i < count($highScoresList); $i += 2) {
                // Even index = Name
                $key = $highScoresList[$i];
                // Odd index = Score
                $value = $highScoresList[$i + 1];
                //Add key/value pair to dict
                $highScoresDict[$key] = $value;

                //If the username entered happens to match a username in the list, save the index where you found it
                if ($username == $key) {
                    $usernameIndexInScoresList = ($i/2); //Divided by 2 because i = 2 at row index 1, etc
                    //Record score for that username
                    $lastScore = $value;
                    //print_r($lastScore);
                }
            }
            //print_r($highScoresDict);


            /*
             * SEE IF USERNAME ALREADY REGISTERED
             * */

            //Establish var for duplicateFound
            //$duplicateFound = false;
            /*https://www.w3schools.com/php/func_filesystem_readfile.asp*/

            //Read file
            $usernameList = file_get_contents("usernames.txt");
            //print_r($usernameList);

            //Make into list
            $usernameList = preg_split("/\s+/", $usernameList, -1, PREG_SPLIT_NO_EMPTY);

            /*
             * IF USERNAME IS ALREADY REGISTERED IN FILE - UPDATE SCORE IF BEATEN, DO NOT ADD AS NEW USER
             * */
            if (array_search($username, $usernameList) !== false) { //"Search for username in list-> false"
                /*
                 * UPDATE SCORE IF HIGH SCORE BEATEN
                 * */
                if ($totalScore > $lastScore) {
                    //Open the file
                    $lines = file( "highscores.txt" , FILE_IGNORE_NEW_LINES );

                    //Add username/score pair at that username's line's index
                    $lines[$usernameIndexInScoresList] = $username . ": " . $totalScore;
                    /*print '<p>Lines in array:</p>';
                    print_r($lines);*/

                    //Put those lines back
                    file_put_contents( "highscores.txt" , implode("\n",$lines));

                    print '<p>High score updated for ' . $username . ': ' . $totalScore . '!</p>';
                }
                /*
                 * IF HIGH SCORE NOT BEATEN, DO NOT UPDATE FILE
                 * */
                else {
                    print '<p>Did not update high score: ' . $totalScore . ' did not beat ' . $username .'\'s best score of: ' . $lastScore . '!</p>';
                }
            }

            /*
             * IF USERNAME IS ALREADY NEW - ADD AS NEW USER TO BOTH FILES
             * */
            else {
                /*
                 * ADD USERNAME TO USERNAMES FILE (Still need this for ease of acquiring username list
                 * */
                @ $usernameFile = fopen("usernames.txt", 'a');

                //On fail
                if (!$usernameFile) {
                    echo '<p><strong>Cannot generate message file</strong></p></body></html>';
                    exit;
                }

                //On success
                else {
                    //Add newline and score
                    $username = "\n" . $username;

                    //write username to file
                    fwrite($usernameFile, $username);
                    print '<p>New username added to file: ' . $username . '</p>';
                }

                /*
                 * ADD NEW USERNAME/SCORE PAIR TO FILE
                 * */
                //Attempt to open file
                @ $highScoresFile = fopen("highscores.txt", 'a');

                //On fail
                if (!$highScoresFile) {
                    echo '<p><strong>Cannot generate message file</strong></p></body></html>';
                    exit;
                }

                //On success
                else {
                    //Add score, write to file, print confirmation msg
                    $totalScore = $username . ": " . $totalScore;
                    fwrite($highScoresFile, $totalScore);
                    print '<p>New highscore added to file: ' . $totalScore . '</p>';
                }
            }
        }
    }
    ?>
    <!--PREVENT REFRESH ON SUBMIT-->
    <!--https://stackoverflow.com/questions/23507608/form-submission-without-page-refresh-->
    <!--<script type="text/javascript">
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
    </script>-->

    <form id="myform" method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>">
        Enter Username to Save High Score (This will reset your current score!!!): <input id="username" type="text" name="f_username" placeholder="name">
        <input onclick="return SignIn();" type="submit">
        <!--<button onclick="return SignIn();" id="button" type="submit">Sign in</button>-->
    </form>
</main>

<ul id="users" style = "color:white">
    <!--<li>user1</li>-->
</ul>

<ul id="score" style="color:white"></ul>

</body>
</html>