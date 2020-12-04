var img;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
    //Enemy Images
    airEnemy = loadImage('https://i.imgur.com/ooIKejL.png');
    waterEnemy = loadImage('https://i.imgur.com/pwuic8V.png');
    earthEnemy = loadImage('https://i.imgur.com/2KhZpg4.png');
    fireEnemy = loadImage('https://i.imgur.com/s4WHBRr.png');

    //Enemy Dead Images
    airEnemyDead = loadImage('https://i.imgur.com/zAMqpod.png');
    waterEnemyDead = loadImage('https://i.imgur.com/r9Fxk5e.png');
    earthEnemyDead = loadImage('https://i.imgur.com/Md2hZLV.png');
    fireEnemyDead = loadImage('https://i.imgur.com/jvgKCbs.png');

    /* Old Images.
    img = loadImage('https://i.imgur.com/2DUZesl.png');
    arrowLeft = loadImage('https://i.imgur.com/CcOkvDT.png');
    arrowRight = loadImage('https://i.imgur.com/4y7A2Mp.png');
    arrowUp = loadImage('https://i.imgur.com/0Gon4BA.png');
    arrowDown = loadImage('https://i.imgur.com/QrY1hhR.png');
    arrowToward = loadImage('https://i.imgur.com/iEr6hoW.png');
    arrowAway = loadImage('https://i.imgur.com/h1XOAaK.png');

    signZero = loadImage('https://i.imgur.com/kac2IQi.png');
    signOne = loadImage('https://i.imgur.com/O0QibpO.png');
    signTwo = loadImage('https://i.imgur.com/1dU6uMc.png');
    signThree = loadImage('https://i.imgur.com/aSugTxx.png');
    signFour = loadImage('https://i.imgur.com/SJxIfo9.png');
    signFive = loadImage('https://i.imgur.com/fwRfelH.png');
    signSix = loadImage('https://i.imgur.com/hGNba3S.png');
    signSeven = loadImage('https://i.imgur.com/1y6tEnX.png');
    signEight = loadImage('https://i.imgur.com/Tgzsovg.png');
    signNine = loadImage('https://i.imgur.com/ojgZr0p.png');

    altSignZero = loadImage('https://i.imgur.com/BohYd1U.png');
    altSignOne = loadImage('https://i.imgur.com/JJGe0Zj.png');
    altSignTwo = loadImage('https://i.imgur.com/qsNYXP4.png');
    altSignThree = loadImage('https://i.imgur.com/ADWFZRp.png');
    altSignFour = loadImage('https://i.imgur.com/tMa2UIi.png');
    altSignFive = loadImage('https://i.imgur.com/DWMr9Ky.png');
    altSignSix = loadImage('https://i.imgur.com/BWPDnsZ.png');
    altSignSeven = loadImage('https://i.imgur.com/N7v36Zv.png');
    altSignEight = loadImage('https://i.imgur.com/UnHaCf6.png');
    altSignNine = loadImage('https://i.imgur.com/abhEB9j.png');

    altSignZeroHOTDOG = loadImage('https://i.imgur.com/FsHWdT7.png');
    altSignOneHOTDOG = loadImage('https://i.imgur.com/nbBQ42p.png');
    altSignTwoHOTDOG = loadImage('https://i.imgur.com/Qa1pD2d.png');
    altSignThreeHOTDOG = loadImage('https://i.imgur.com/cbylXK6.png');
    altSignFourHOTDOG = loadImage('https://i.imgur.com/V2CZsEQ.png');
    altSignFiveHOTDOG = loadImage('https://i.imgur.com/DF9gzAe.png');
    altSignSixHOTDOG = loadImage('https://i.imgur.com/8BBRCmV.png');
    altSignSevenHOTDOG = loadImage('https://i.imgur.com/j7XhmA4.png ');
    altSignEightHOTDOG = loadImage('https://i.imgur.com/iP5eWEY.png');
    altSignNineHOTDOG = loadImage('https://i.imgur.com/8U6Ieqh.png');*/
}