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
    <form id="myform">
        <input id="username" type="text" name="username" placeholder="name">
        <button onclick="return SignIn();" type="submit">Sign in</button>
    </form>
</main>

<ul id="users" style = "color:black">
    <li>user1</li>
</ul>
</body>
</html>
