//Global var for users list
usernameList = [];
var list;

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

    /*//Add to local list
    print(usernameList);*/

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

    // Establish list
    list = document.getElementById('users');

    //console.log("LIST INIT: ", can);

    //New User
    if (IsNewUser(username,list)) {
        usernameList.push(username);
        CreateNewUser(username,list);
        //CreateSignInItem(username,list);
    }
    else {
        console.log(username, "is already registered.")
        //ID = String(username) + "_signins";
        //listItem = document.getElementById( ID );
        //listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
    }

    console.log("list: ", list.innerHTML);

    //return false;
    return true;
}

function DisplayList() {
    // Establish list
    list = document.getElementById('users');
    ReadFile();
    for (var i = 0; i < usernameList.length; i++) {

        console.log(usernameList[i]);
    }
}

function ReadFile() {

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
    //console.log(xmlDoc.toString());

    //Split names at newline to generate username list
    usernameList = xmlDoc.split("\n")

    //Add those to HTML
    //Go through each item in list and add to user list
    for (var i = 0; i < usernameList.length; i++) {

        //Get username from file-list
        var username = usernameList[i];

        //Add to list
        CreateNewUser(username, list);
        //CreateSignInItem(username, list);
    }
}