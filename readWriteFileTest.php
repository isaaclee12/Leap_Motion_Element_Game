<!DOCTYPE html>

<html>

    <head>
        <script src="https://cdn.jsdelivr.net/gh/nicolaspanel/numjs@0.15.1/dist/numjs.min.js"></script>
        <script src="https://unpkg.com/ml5@0.4.3/dist/ml5.min.js"></script>
        <script type="text/javascript" src="http://js.leapmotion.com/leap-0.6.3.min.js"></script>
        <script src="readWriteFileTest.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
        <script src="prepareToDraw.js"></script>
    </head>

    <body>
        <?php function getData($field) {
        if (!isset($_POST[$field])) {
        $data = "";
        }
        else {
        $data = trim($_POST[$field]);
        $data = htmlspecialchars($data);
        }
        return $data;
        }
        ?>
        <main>
            <?php
            print '<p>Post Array:</p><pre>';
            print_r($_POST);
            print '</pre>';

            //process form when it is submitted
            //Sanitize data of username
            //$firstName = filter_var($_POST["username"], FILTER_SANITIZE_STRING);

            //print '<p>POST WORKED</p>';

            //Write to file
            @ $fp = fopen("usernames.txt", 'a');
            if (!$fp) {
                echo '<p><strong>Cannot generate message file</strong></p></body></html>';
                exit;
            }
            else {
                //get username
                $outputstring  = filter_var($_POST["username"], FILTER_SANITIZE_STRING);
                fwrite($fp, $outputstring);
                print '<p>Message inserted</p>';
            }

            /*if ($_SERVER["REQUEST_METHOD"] == "POST") {

            }*/

            //Initialize Vars
            /*$boolWritingToFile = False;

            //process form when it is submitted
            if ($_SERVER["REQUEST_METHOD"] == "POST") {}

            //Writing to File
            if ($boolWritingToFile) {

                //Open the file
                $myfile = fopen("usernames.txt", "a") or die("Unable to open file!");

                //Write text
                $txt = "\nEgg\n";
                fwrite($myfile, $txt);

                //If the file exists
                if ($myfile) {
                    print '<p>Written to file successfully.</p>';
                    fclose($myfile);
                }
            }*/
            ?>
            <form id="myform">
                <input id="username" type="text" name="username" placeholder="name">
                <button onclick="return SignIn();" id="button" type="submit">Sign in</button>
            </form>
        </main>

        <ul id="users" style = "color:black">
            <li>user1</li>
        </ul>

    </body>


</html>
