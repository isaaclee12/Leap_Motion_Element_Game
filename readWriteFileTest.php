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
        <main>
<?php
print '<p>Post Array:</p><pre>';
print_r($_POST);
print '</pre>';


//process form when it is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //VARS
    $dataIsClean = true;

    //Sanitize data of username
    $username = filter_var($_POST["username"], FILTER_SANITIZE_STRING);

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
    print '<p>Username: ' . $username . '</p>';

    //data to file
    If data clean,
    if ($dataIsClean) {
        //Write to file
        @ $fp = fopen("usernames.txt", 'a');
        if (!$fp) {
            echo '<p><strong>Cannot generate message file</strong></p></body></html>';
            exit;
        }
        else {
            //get username
            $outputstring  = $username;
            fwrite($fp, $outputstring);
            print '<p>Message inserted</p>';
        }
    }

}

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

            <form id="myform" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
                Enter Userame: <input id="username" type="text" name="f_username" placeholder="name">
                <button onclick="return SignIn();" id="button" type="submit">Sign in</button>
            </form>
        </main>

        <ul id="users" style = "color:black">
            <li>user1</li>
        </ul>

    </body>


</html>


<!DOCTYPE html>
<html>
<body>



<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
// collect value of input field
$name = $_POST['fname'];
if (empty($name)) {
echo "Name is empty";
} else {
echo $name;
}
}
?>

</body>
</html>