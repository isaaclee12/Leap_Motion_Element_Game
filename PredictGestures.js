// Add Leap Controller
controllerOptions = {};

// kNN Classifier
const knnClassifier = ml5.KNNClassifier();

// Set bool to false by default
var trainingCompleted = false;

// Prediction Average Equation Vars
var predictionAccuracyAverage = 0;
var numPredictions = 0;
var currentPrediction;

var row = 0;
var col = 0;

var framesOfData = nj.zeros([5,4,6]);
var currentTestingSample = nj.zeros([5,4,6]);

// Force printing of long arrays
nj.config.printThreshold = 1000;

// More vars.
var programState = 0;
var itemToPredict = 0;
var userElement = -1;

//Time
var timeSinceLastChange = new Date();
var timeLimit = 5;

//Elements/Enemies
var elements = ["Air", "Water", "Earth", "Fire", "Lightning", "Wood"];


// Num hands
var handCount = 0;

// data on hands
var hand1, hand2;


// Center Data
function centerData(features) {

	// Center Data
	centerXData(features);
	centerYData(features);
	centerZData(features);

	// Reshape into 120 item 2D vector
	features = features.reshape(120, 1);

	return features;
}
function centerXData(dataFrames) {

	var xValues = dataFrames.slice([],[],[0,6,3]);

	var currentMean = xValues.mean();

	var horizontalShift = 0.5 - currentMean;

	// 1st Sheet - x1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentX = dataFrames.get(currentRow,currentColumn, 0);
			var shiftedX = currentX + horizontalShift;
			dataFrames.set(currentRow, currentColumn, 0, shiftedX);
		}
	}

	// 4th Sheet - x2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentX = dataFrames.get(currentRow,currentColumn, 3);
			shiftedX = currentX + horizontalShift;
			dataFrames.set(currentRow, currentColumn, 3, shiftedX);
		}
	}
}
function centerYData(dataFrames) {

	var yValues = dataFrames.slice([],[],[1,6,4]);

	var currentMean = yValues.mean();

	var verticalShift = 0.5 - currentMean;

	// 2nd Sheet - y1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentY = dataFrames.get(currentRow,currentColumn, 1);
			var shiftedY = currentY + verticalShift;
			dataFrames.set(currentRow, currentColumn, 1, shiftedY);
		}
	}

	// 5th Sheet - y2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentY = dataFrames.get(currentRow,currentColumn, 4);
			shiftedY = currentY + verticalShift;
			dataFrames.set(currentRow, currentColumn, 4, shiftedY);
		}
	}
}
function centerZData(dataFrames) {

	var zValues = dataFrames.slice([],[],[2,6,5]);

	var currentMean = zValues.mean();

	var zShift = 0.5 - currentMean;

	// 2nd Sheet - y1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentZ = dataFrames.get(currentRow,currentColumn, 2);
			var shiftedZ = currentZ + zShift;
			dataFrames.set(currentRow, currentColumn, 2, shiftedZ);
		}
	}

	// 5th Sheet - y2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentZ = dataFrames.get(currentRow,currentColumn, 5);
			shiftedZ = currentZ + zShift;
			dataFrames.set(currentRow, currentColumn, 5, shiftedZ);
		}
	}
}

// Mirror and Center Data
function centerMirrorData(features) {

	// Center Data - Mirror
	mirrorData(features);
	centerYData(features);
	centerZData(features);

	// Reshape into 120 item 2D vector
	features = features.reshape(120, 1);

	return features;
}
function mirrorData(dataFrames) {

	var xValues = dataFrames.slice([],[],[0,6,3]);

	var currentMean = xValues.mean();

	var horizontalShift = 0.5 - currentMean;

	// 1st Sheet - x1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentX = dataFrames.get(currentRow,currentColumn, 0);
			var shiftedX = currentX + horizontalShift;
			shiftedX = 1 - shiftedX;
			dataFrames.set(currentRow, currentColumn, 0, shiftedX);
		}
	}

	// 4th Sheet - x2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentX = dataFrames.get(currentRow,currentColumn, 3);
			shiftedX = currentX + horizontalShift;
			shiftedX = 1 - shiftedX;
			dataFrames.set(currentRow, currentColumn, 3, shiftedX);
		}
	}
}

// Train
function TrainKNNIfNotDoneYet() {
	if (trainingCompleted === false) {
		train();
	}
}
function train() {

	for (var i = 0; i < 2; i++) {

		// 0 = Air
		features = air1.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);
		features = air1.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 0);

		/*features = air2.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);
		features = air3.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);
		features = air4.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);
		features = air5.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);
		features = air6.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 0);*/



		// 1 = Fire
		features = fire1.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire1.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);

		features = fire2.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire2.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);

		features = fire3.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire3.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);

		features = fire4.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire4.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);

		features = fire5.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire5.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);

		features = fire6.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire6.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 1);



		// 2 = water
		features = water1.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water1.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

		features = water2.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water2.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

		features = water3.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water3.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

		features = water4.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water4.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

		features = water5.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water5.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

		features = water6.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 2);
		features = water6.pick(null,null,null,i);
		features = centerMirrorData(features);
		knnClassifier.addExample(features.tolist(), 2);

	}

	trainingCompleted = true;
}
function test() {

	// Extract ith 3D Tensor
	currentTestingSample = framesOfData.clone();// .pick(null, null, null, null); // //
	// console.log(currentTestingSample.toString());

	// Center Data
	centerXData(currentTestingSample);
	centerYData(currentTestingSample);
	centerZData(currentTestingSample);

	// console.log(currentTestingSample.toString(),"DIV:",framesOfData.toString());

	// Reshape into 120 item 2D vector
	currentTestingSample = currentTestingSample.reshape(120, 1);

	try {
		// Classify // currentPrediction =
		knnClassifier.classify(currentTestingSample.tolist(),GotResults);
		// currentPrediction = parseInt(currentPrediction);

		// Increment
		++numPredictions;

		// m = (n − 1)m + (c == d) / n
		predictionAccuracyAverage = (((numPredictions - 1)*predictionAccuracyAverage) + (currentPrediction === itemToPredict)) / numPredictions;

		// Log accuracy
		// console.log(numPredictions, predictionAccuracyAverage, currentPrediction);
	} catch {
		console.log("knn error");
	}


}
function GotResults(err, result) {

	// console.log("PREDICTED LABEL: ", parseInt(result.label)); // "INDEX: ",testingSampleIndex,
	currentPrediction = parseInt(result.label);


	// 1 Hand:
	if (handCount === 1) {

		//FIRE = Single Fist
		if (parseInt(result.label) === 1) {
			userElement = "FIRE";
		}

		//AIR = Single Palm
		else if (parseInt(result.label) === 0) {
			userElement = "AIR";
		}
	}

	// 2 Hands:
	else if (handCount === 2) {

		//EARTH = Two Fists
		if (parseInt(result.label) === 1) {
			userElement = "EARTH";
		}

		//WATER = Two Palms
		else { //For some reason, removing this makes the element detection smoother -> (parseInt(result.label) === 0)
			userElement = "WATER";
		}
	}

	// No Hands:
	else {
		userElement = "NONE";
	}

	// print label:
	// console.log("PREDICTION: ", userElement, "ENEMY: ", enemyElement);

	// Return it
	return(parseInt(result.label));
}

//Handle Element
function HandleElement(bone, handCount, fingerIndex, boneType, canvasX1, canvasY1) {
	try {
		//Set Vars
		textSize(32);
		var diameter = 30;

		if (userElement === "AIR") {

			//If bone is tip of middle finger
			if (fingerIndex === 2 && boneType === 3) {

				//Color = Light Grey
				stroke('rgb(214, 214, 214)');
				fill('rgb(214, 214, 214)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 + 200, diameter);

				//Write text
				strokeWeight(1);
				text('Air', userElementTextX, userElementTextY);
			}
		}

		else if (userElement === "WATER") {

			//If bone is tip of middle finger
			if (fingerIndex === 2 && boneType === 3) {

				//Color = Blue
				stroke('rgb(74, 183, 255)');
				fill('rgb(74, 183, 255)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 + 200, diameter);

				//Write text
				strokeWeight(1);
				text('Water', userElementTextX, userElementTextY);
			}
		}

		else if (userElement === "EARTH") {

			//If bone is 1st knuckle of middle finger
			if (fingerIndex === 2 && boneType === 1) {

				//Color = Brown
				stroke('rgb(82, 72, 45)');
				fill('rgb(82, 72, 45)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 - 20, diameter);

				//Write text
				strokeWeight(1);
				text('Earth', userElementTextX, userElementTextY);

				/*//SCALE LOCATION
                // newCoordinate = ((oldCoordinate - newMin) * factorToScaleBy) / (newMax - newMin);
                var elementX = ((canvasX1 - 0) * 1) / (window.innerWidth - 0);
                var elementY = ((canvasY1 - 0) * 1) / (window.innerHeight - 0);

                //Draw a circle that appears to be in front of hand, hopefully
                circle(elementX, elementY, diameter);
                // console.log("X: ", canvasX1, "Y: ", canvasY1);*/
			}
		}

		else if (userElement === "FIRE") {

			//If bone is 1st knuckle of middle finger
			if (fingerIndex === 2 && boneType === 1) {

				//Color = Red Orange
				stroke('rgb(252, 104, 40)');
				fill('rgb(252, 104, 40)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 - 20, diameter);

				//Write text
				strokeWeight(1);
				text('Fire', userElementTextX, userElementTextY);

				/*//SCALE LOCATION
                // newCoordinate = ((oldCoordinate - newMin) * factorToScaleBy) / (newMax - newMin);
                var elementX = ((canvasX1 - 0) * 1) / (window.innerWidth - 0);
                var elementY = ((canvasY1 - 0) * 1) / (window.innerHeight - 0);

                //Draw a circle that appears to be in front of hand, hopefully
                circle(elementX, elementY, diameter);
                // console.log("X: ", canvasX1, "Y: ", canvasY1);*/
			}
		}

		else if (userElement === "NONE") {
			//Color = Black
			stroke('rgb(0, 0, 0)');
			fill('rgb(0, 0, 0)');

			//Write text
			strokeWeight(1);
			text('None', userElementTextX, userElementTextY);
		}

	}
	catch(err) {

	}

}
function ScaleElement() {
	/*var xValues = dataFrames.slice([],[],[0,6,3]);

	var currentMean = xValues.mean();

	var horizontalShift = 0.5 - currentMean;

	// 1st Sheet - x1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentX = dataFrames.get(currentRow,currentColumn, 0);
			var shiftedX = currentX + horizontalShift;
			dataFrames.set(currentRow, currentColumn, 0, shiftedX);
		}
	}

	// 4th Sheet - x2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentX = dataFrames.get(currentRow,currentColumn, 3);
			shiftedX = currentX + horizontalShift;
			dataFrames.set(currentRow, currentColumn, 3, shiftedX);
		}
	}*/
}

var userElementTextX = window.innerWidth/10;
var userElementTextY = window.innerHeight/10;

//Enemy Flags/vars
var enemyAlive = false;
var enemyID = -1;
var lastEnemyID = -1;
var enemyElement = "";
var enemyWeakness = "";

//Enemy Text Coords
var enemyElementTextX = window.innerWidth * .90;
var enemyElementTextY = window.innerHeight/10;

//Flags for handling enemy dead/alive/printing/generating states
var firstRun = true;
var showingDeadEnemy = true;

//Flags for handling difficulty
var difficulty = 0;
var winCounter = 0;
var showingEnemyWeakness = true;
var showingEnemyElement = true;
var enemyDeathIsSlow = true;
function HandleDifficulty() {
	//After 10 wins...
	if (winCounter >= 10) {
		//Increase difficulty by one
		difficulty++;
	}

	//New Conditions based on difficulty level:
	switch (difficulty) {
		//0: Show all, Slow Enemy Regen
		case 0:
			showingEnemyWeakness = true;
			showingEnemyElement = true;
			enemyDeathIsSlow = true;
			break;

		//1: Don't show enemy weakness
		case 1:
			showingEnemyWeakness = false;
			break;

		//2: Don't show enemy weakness or element
		case 2:
			showingEnemyWeakness = false;
			showingEnemyElement = false;
			break;

		//3: Enemy Re-spawns Quickly
		case 3:
			showingEnemyWeakness = false;
			showingEnemyElement = false;
			enemyDeathIsSlow = false;
			break;

		//4: Reset
		case 4:
			console.log("You win! Resetting game.")
			difficulty = 0;
			showingEnemyWeakness = true;
			showingEnemyElement = true;
			enemyDeathIsSlow = true;
			break;

		//Error:
		default:
			console.log("Error: Difficulty not in range [0,3]")
	}
}

function HandleEnemy() {

	if (!enemyAlive) {
		console.log("Enemy Dead");

		if (firstRun) {
			//Spawn 1st enemy
			generateNewEnemy();
			//Break from first loop
			firstRun = false;
			//Init enemy, break loop
			enemyAlive = true;
			showEnemy();
			//console.log("First Enemy: ", enemyElement);
		}

		//Show dead enemy if any run after first
		else if (showingDeadEnemy && !firstRun) {
			//console.log("Showing dead enemy");

			//Show Image of Dead Enemy before respawn
			showDeadEnemy();
		}

		//Done showing dead enemy, after first run
		else if (!showingDeadEnemy) { //if (!showingDeadEnemy && !firstRun)

			//Iterate win counter
			winCounter++;

			//Change difficulty if need be
			HandleDifficulty();

			console.log("Spawning new enemy");
			//Record Score
			recordScore();

			//new enemy
			generateNewEnemy()

			//if dead, increase counter
			wins += 1;

			//Wait until training done on init to summon new enemy
			//Summon enemy!
			if (trainingCompleted) {
				enemyAlive = true;
			}
		}
	}

	//Enemy alive
	else {
		//Show the enemy
		showEnemy();

		//Check if enemy alive
		enemyAlive = CheckIfEnemyAlive();

		//if they just died, switch flag for showing dead enemy
		if (!enemyAlive) {
			showingDeadEnemy = true;
		}
	}

	//Print enemy element and weakness

	//Diff 0
	if (showingEnemyWeakness) {
		text("Enemy Weakness: " + enemyWeakness, enemyElementTextX * (7/9), 2 * enemyElementTextY);
	}

	//Diff 0 thru 1
	if (showingEnemyElement) {
		text("Enemy Element: " + enemyElement, enemyElementTextX * (7/9), enemyElementTextY);
	}

	//Print stats
	// var winCounter = "Wins: " + wins;
	// text(winCounter, enemyElementTextX * (7/9), enemyElementTextY * 3);
}

function generateNewEnemy() {
	//Generate new enemy w/ new element:
	//Random num 0 to 3
	enemyID = Math.floor(Math.random() * 4);

	//Validation: Make sure element is different this time
	while(enemyID === lastEnemyID) {
		enemyID = Math.floor(Math.random() * 4);
	}

	// Keep track of last enemy id
	lastEnemyID = enemyID;
}

var enemyWidth = window.innerWidth/4;
var enemyHeight = window.innerHeight/6;
function showEnemy() {

	switch (enemyID) {
		case 0:
			// text("Air", enemyElementTextX, enemyElementTextY);
			enemyElement = "AIR";
			enemyWeakness = "FIRE";
			image(airEnemy, enemyWidth, enemyHeight);
			break;
		case 1:
			// text("Water", enemyElementTextX, enemyElementTextY);
			enemyElement = "WATER";
			enemyWeakness = "AIR";
			image(waterEnemy, enemyWidth, enemyHeight);
			break;
		case 2:
			// text("Earth", enemyElementTextX, enemyElementTextY);
			enemyElement = "EARTH";
			enemyWeakness = "WATER";
			image(earthEnemy, enemyWidth, enemyHeight);
			break;
		case 3:
			// text("Fire", enemyElementTextX, enemyElementTextY);
			enemyElement = "FIRE";
			enemyWeakness = "EARTH";
			image(fireEnemy, enemyWidth, enemyHeight);
			break;
		default:
			text("Error: Enemy ID Out Of Range", enemyElementTextX, enemyElementTextY);
			break;
	}
}
function CheckIfEnemyAlive() {

	//console.log("USER:",userElement,"ENEMY:",enemyElement);

	//Element Weaknesses (4)

	//Air > Water
	if (userElement === "AIR" && enemyElement === "WATER") {
		return false;
	}

	//Water > Earth
	else if (userElement === "WATER" && enemyElement === "EARTH") {
		return false;
	}

	//Earth > Fire
	else if (userElement === "EARTH" && enemyElement === "FIRE") {
		return false;
	}

	//Fire > Air
	else if (userElement === "FIRE" && enemyElement === "AIR") {
		return false;
	}

	//No weakness = no change
	return true;
}

// Handle Enemy Death
var timeSinceLastEnemyDeath = new Date();
var gotTimeSinceLastEnemyDeath = false;
var timeToShowEnemyDeathImage = 1;
function showDeadEnemy() {

	//Get current time
	var currentTime = new Date();

	//Get timestamp of when enemy died
	if (!gotTimeSinceLastEnemyDeath) {

		//On first frame only!
		timeSinceLastEnemyDeath = new Date();

		//Set bool to true
		gotTimeSinceLastEnemyDeath = true;
	}


	//Calculate time since enemy died
	var timeChangeInMilliseconds = currentTime - timeSinceLastEnemyDeath;
	var enemyDeathTimer = timeChangeInMilliseconds/1000;

	//While 1 second hasn't passed...
	if (enemyDeathTimer < timeToShowEnemyDeathImage) {
		//Keep updating the time
		/*currentTime = new Date();
		timeChangeInMilliseconds = currentTime - timeSinceLastEnemyDeath;
		enemyDeathTimer = timeChangeInMilliseconds/1000;*/

		console.log("Showing Dead Enemy Image");

		//Show image of the dead enemy
		showDeadEnemyImage();
	}

	else {
		console.log("No Longer Showing Dead Enemy Image");
		//After one second, reset the vars.
		//timeSinceLastEnemyDeath = new Date();
		gotTimeSinceLastEnemyDeath = false;


		//Break from loop
		showingDeadEnemy = false;

		//Set score recording flag to true
		//ableToRecordScore = true;
	}
}
function showDeadEnemyImage() {
	switch (enemyElement) {
		case "AIR":
			//text("Air", enemyElementTextX, enemyElementTextY);
			image(airEnemyDead, enemyWidth, enemyHeight);
			break;
		case "WATER":
			//text("Water", enemyElementTextX, enemyElementTextY);
			image(waterEnemyDead, enemyWidth, enemyHeight);
			break;
		case "EARTH":
			//text("Earth", enemyElementTextX, enemyElementTextY);
			image(earthEnemyDead, enemyWidth, enemyHeight);
			break;
		case "FIRE":
			//text("Fire", enemyElementTextX, enemyElementTextY);
			image(fireEnemyDead, enemyWidth, enemyHeight);
			break;
		default:
			//text("Error: Dead Enemy Element Invalid", enemyElementTextX, enemyElementTextY);
			break;
	}
}

//var timeSinceLastChange = new Date();
var timeChangeInSeconds = 0;
var score = 0;
var totalScore = 0;
function recordScore() {
	//Get time since last win
	currentTime = new Date();
	timeChangeInMilliseconds = currentTime - timeSinceLastChange;
	timeChangeInSeconds = timeChangeInMilliseconds/1000;

	//Record score (100 - 5*time)
	score = 100 - (parseInt(timeChangeInSeconds) * 20);

	//Score minimum 10
	if (score < 10) {
		score = 10;
	}

	//Add to total (If statement prevents score from iterating on initialization,
	// i.e. it waits until training is done.
	if (trainingCompleted) {
		totalScore += score;
	}

	//Write score to file
	WriteScoreToFile();

	//New init time
	timeSinceLastChange = new Date();
	timeChangeInSeconds = 0;

	// text(score, scoreTextX, scoreTextY - (window.innerHeight/20))
	//return true;
	/*//Timer runs until current time is 3 seconds after
	if (timeChangeInSeconds < timeLimit) {
		currentTime = new Date();
		timeChangeInMilliseconds = currentTime - timeSinceLastChange;
		timeChangeInSeconds = timeChangeInMilliseconds/1000;

		return false;
	}*/
}
var confirmWrite = "";
function WriteScoreToFile() {

	//Make a cookie
	$(document).ready(function () {
		document.cookie = "total_score" + "=" + escape(totalScore) + "; path=/"; //+ expires
		//console.log("Cookie:", document.cookie);
	});
}

// Handle Frame
function HandleFrame(frame) {

	// Num hands
	handCount = frame.hands.length;

	// data on hands
	hand1 = frame.hands[0];
	hand2 = frame.hands[1];

	// Interaction Box
	var interactionBox = frame.interactionBox;

	HandleHand(hand1, handCount, interactionBox);
	HandleHand(hand2, handCount, interactionBox);
}
function HandleHand(hand, handCount, interactionBox) {

	// fingers
	try {
		var fingers = hand.fingers; // fingers in first hand

		// each finger TAKEN FROM:
		// https:// developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.fingers[], much easier for loop to work with.

		// From distal to metacarpal,
		for (var phalangeNum = 4; phalangeNum >= 0; phalangeNum--) {

			// From thumb to pinky
			for (var fingerNum = 0; fingerNum <= 4; fingerNum++) {
				HandleBone(fingers[fingerNum].bones[phalangeNum], handCount, fingerNum, interactionBox);
			}
		}

	} catch(err) {
		// console.log("Fingers failed");
	}

}
function HandleBone(bone, handCount, fingerIndex, interactionBox) {

	try {

		// Normalize point w/ interaction box
		var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
		// console.log("Prev:",normalizedPrevJoint.toString());

		var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
		// console.log("Next:",normalizedNextJoint.toString());

		// Save coordinates to vars
		var x1 = normalizedPrevJoint[0];
		var y1 = normalizedPrevJoint[1];
		var z1 = normalizedPrevJoint[2];
		var x2 = normalizedNextJoint[0];
		var y2 = normalizedNextJoint[1];
		var z2 = normalizedNextJoint[2];

		// Record to arrays
		row = fingerIndex;
		col = bone.type;
		framesOfData.set(row, col, 0, x1);
		framesOfData.set(row, col, 1, y1);
		framesOfData.set(row, col, 2, z1);
		framesOfData.set(row, col, 3, x2);
		framesOfData.set(row, col, 4, y2);
		framesOfData.set(row, col, 5, z2);

		// **MAKE SURE TRANSFORM HAPPENS AFTER DATA IS RECORDED**
		// Scale new points to canvas
		var canvasX1 = window.innerWidth * x1;
		var canvasY1 = window.innerHeight * (1 - y1);
		var canvasX2 = window.innerWidth * x2;
		var canvasY2 = window.innerHeight * (1 - y2);

		// Z min and max
		var rawZmax = 200;
		var rawZmin = -200

		// Stroke thickness
		var strokeWeightMax = 50;
		var zStrokeWeight = ((bone.prevJoint[2] - rawZmin) * strokeWeightMax) / (rawZmax - rawZmin);

		// Bone segment number
		var boneType = bone.type;

		/*var red = (1 - predictionAccuracyAverage) * 255;
		var blue = predictionAccuracyAverage * 255;
		// console.log("RED: ", red, " GREEN: ", green);

		// Hands always grey, regardless of count
		if (boneType === 0) {
			stroke(red,  blue, 100);
		} else if (boneType === 1) {
			stroke(red,  blue, 75);
		} else if (boneType === 2) {
			stroke(red, blue,  50);
		} else if (boneType === 3) {
			stroke(red, blue,  25);
		}*/

		/*// GREEN IF 1 HAND
		if (handCount === 1) {

			if (boneType === 0) {
				stroke('rgb(179, 255, 224)');
			} else if (boneType === 1) {
				stroke('rgb(77, 255, 184)');
			} else if (boneType === 2) {
				stroke('rgb(0, 230, 138)');
			} else if (boneType === 3) {
				stroke('rgb(0, 153, 92)');
			}

			// RED IF 2 HANDS
		} else if (handCount === 2) {

			if (boneType === 0) {
				stroke('rgb(255, 214, 204)');
			} else if (boneType === 1) {
				stroke('rgb(255, 133, 102)');
			} else if (boneType === 2) {
				stroke('rgb(255, 71, 26)');
			} else if (boneType === 3) {
				stroke('rgb(179, 36, 0)');
			}

		}*/

		//Set hand colors
		if (boneType === 0) {
			stroke('rgb(179, 255, 224)');
		} else if (boneType === 1) {
			stroke('rgb(77, 255, 184)');
		} else if (boneType === 2) {
			stroke('rgb(0, 230, 138)');
		} else if (boneType === 3) {
			stroke('rgb(0, 153, 92)');
		}

		strokeWeight(zStrokeWeight/5);

		line(canvasX1,canvasY1,canvasX2,canvasY2);

		HandleElement(bone, handCount, fingerIndex, boneType, canvasX1, canvasY1);
	}
	catch(err) {
		// console.log("Drawing line failed");
	}
}

// Determine State
function DetermineState(frame) {

	// Num hands
	var handCount = frame.hands.length;

	// If no hands
	if (handCount === 0) {
		programState = 0;
	}

	// If 1 hand
	else if (handCount === 1) {
		programState = 1;
	}

	// If 2 hands
	else {
		programState = 2;
	}

}
// No Hands
function HandleState0(frame) {
	TrainKNNIfNotDoneYet();
}
// 1 Hand
function HandleState1(frame) {
	// Draw hands
	HandleFrame(frame);
	test();
}
// 2 Hands
function HandleState2(frame) {
	// Draw hands
	HandleFrame(frame);
	test();
}

//SIGN IN

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
}

//Establish global username var
var username;
//Sign in
function SignIn() {
	username = document.getElementById('username').value;

	// Establish list
	list = document.getElementById('users');

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

	//console.log("list: ", list.innerHTML);

	//return false;
	return true;
}

var scoreTextX = window.innerWidth/20;
var scoreTextY = window.innerHeight/2;
var scoreTextIncrementYDefault = (3*window.innerHeight)/20; // Three 20ths of window height.
var scoreTextIncrementY = scoreTextIncrementYDefault;
function DisplayList() {
	// Establish list
	list = document.getElementById('users');

	ReadFile();

	//display text file status
	text(confirmWrite, 100, 100);

	//Draw current score
	text("Latest Score: " + score, scoreTextX, scoreTextY - (2 * window.innerHeight/20));
	text("Total Score: " + totalScore, scoreTextX, scoreTextY - (window.innerHeight/20));
	// console.log("Total Score:", totalScore);

	//Render High Scores Label
	text("High Scores:", scoreTextX, scoreTextY);

	//Draw list in order in bottom left
	for (var i = 0; i < usernameList.length; i++) {

		//Display each score as a list,
		text(usernameList[i], scoreTextX, (scoreTextY + scoreTextIncrementY));

		//Increment y
		scoreTextIncrementY += window.innerHeight/20;
	}

	//Reset increment
	scoreTextIncrementY = scoreTextIncrementYDefault;
}

var haveReadFile = false;
function ReadFile() {

	if (!haveReadFile) {
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
		xmlhttp.open("GET","highscores.txt",false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseText;

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

		//Lock out
		haveReadFile = true;
	}

}

// LEAP TIME
Leap.loop(controllerOptions, function(frame) {
	// Exception just so we don't crash on error
	try {
		clear();

		//Set Vars for text
		strokeWeight(1);
		fill('rgb(0, 0, 0)');
		stroke('rgb(0, 0, 0)');

		//Always display score list
		DisplayList()

		HandleEnemy();
		HandleFrame(frame);

		DetermineState(frame);

		if (programState === 0) {
			HandleState0(frame);
		}

		else if (programState === 1) {
			HandleState1(frame);
		}

		else if (programState === 2) {
			HandleState2(frame);
		}

	} catch {
	}
}
);
