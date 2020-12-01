//Check if New User
function IsNewUser(username,list) {
    // console.log(list);
    var users = list.children;

    usernameFound = false;

    for (var i = 0; i < users.length; i++) {
        if (users[i].innerHTML == username) {
            usernameFound = true;
        }
        // console.log("inner: ",users[i].innerHTML);
    }

    return usernameFound == false;
    // usernameFound = false;
}

//Create new user
function CreateNewUser(username,list) {
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
}

//Create new user
function CreateSignInItem(username,list) {
    var item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.innerHTML = 1;
    list.appendChild(item);
}

//Sign in
function SignIn() {
    username = document.getElementById('username').value;
    //console.log(username);

    var list = document.getElementById('users');

    ReadFile();

    //New User
    if (IsNewUser(username,list)) {
        CreateNewUser(username,list);
        CreateSignInItem(username,list);
        //WriteToFile(username);
    }
    else {
        ID = String(username) + "_signins";
        listItem = document.getElementById( ID );
        listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
    }

    console.log("list: ", list.innerHTML); //innerHTML

    // console.log("Users: ", users);

    return false;
}

function ReadFile() {
    console.log("hi");

    //From: https://stackoverflow.com/questions/8137225/read-txt-file-via-client-javascript
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","usernames.txt",false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseText;

    //Got doc!
    console.log(xmlDoc.toString());
}

function WriteToFile(item) {


    // fh = fopen(getScriptPath("usernames.txt"), 0); // Open the file for reading
    //
    // // If the file has been successfully opened
    // if(fh != -1) {
    //     var str = "Some text goes here...";
    //     fwrite(fh, str); // Write the string to a file
    //     fclose(fh); // Close the file
    // }

    /*console.log(item);
    var fs = require('fs');

    fs.appendFile('usernames.txt', item, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });*/
}