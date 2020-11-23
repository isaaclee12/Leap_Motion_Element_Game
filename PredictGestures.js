/*
var numFeatures = testArray.shape[2];
var oneFrameOfData = nj.zeros([5,4,6]);

//Num Samples = Coordinate sets in testArray
var numSamples = 20;

var currentFeatures;
var currentLabel;
//var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros([numSamples]);
var predictedLabel;

var userID = 1;
var timeSinceLastDigitChange = new Date();

//D10
var scorePerDigit = nj.zeros([10]);
var scoresInitialized = false;
var signedAllTen = false;

var averageArray = nj.zeros([10]);
var averageArrayIndex = 0;

var signTimeLimitDefault = 6;
var signTimeLimit = signTimeLimitDefault;

var difficulty = 0;*/

//Add Leap Controller
controllerOptions = {};

//kNN Classifier
const knnClassifier = ml5.KNNClassifier();

//Set bool to false by default
var trainingCompleted = false;

//Prediction Average Equation Vars
var predictionAccuracyAverage = 0;
var numPredictions = 0;
var currentPrediction;

var row = 0;
var col = 0;

var framesOfData = nj.zeros([5,4,6]);
var currentTestingSample = nj.zeros([5,4,6]);

//Force printing of long arrays
nj.config.printThreshold = 1000;

// More vars.
var programState = 0;
var itemToPredict = 0;
var element = -1;

//Center Data
function centerData(features) {

	//Center Data
	centerXData(features);
	centerYData(features);
	centerZData(features);

	//Reshape into 120 item 2D vector
	features = features.reshape(120, 1);

	return features;
}

function centerXData(dataFrames) {

	var xValues = dataFrames.slice([],[],[0,6,3]);

	var currentMean = xValues.mean();

	var horizontalShift = 0.5 - currentMean;

	//1st Sheet - x1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentX = dataFrames.get(currentRow,currentColumn, 0);
			var shiftedX = currentX + horizontalShift;
			dataFrames.set(currentRow, currentColumn, 0, shiftedX);
		}
	}

	//4th Sheet - x2
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

	//2nd Sheet - y1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentY = dataFrames.get(currentRow,currentColumn, 1);
			var shiftedY = currentY + verticalShift;
			dataFrames.set(currentRow, currentColumn, 1, shiftedY);
		}
	}

	//5th Sheet - y2
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

	//2nd Sheet - y1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentZ = dataFrames.get(currentRow,currentColumn, 2);
			var shiftedZ = currentZ + zShift;
			dataFrames.set(currentRow, currentColumn, 2, shiftedZ);
		}
	}

	//5th Sheet - y2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentZ = dataFrames.get(currentRow,currentColumn, 5);
			shiftedZ = currentZ + zShift;
			dataFrames.set(currentRow, currentColumn, 5, shiftedZ);
		}
	}
}

//Mirror and Center Data
function centerMirrorData(features) {

	//Center Data - Mirror
	mirrorData(features);
	centerYData(features);
	centerZData(features);

	//Reshape into 120 item 2D vector
	features = features.reshape(120, 1);

	return features;
}

function mirrorData(dataFrames) {

	var xValues = dataFrames.slice([],[],[0,6,3]);

	var currentMean = xValues.mean();

	var horizontalShift = 0.5 - currentMean;

	//1st Sheet - x1
	for (var currentRow = 0; currentRow <= 5; ++currentRow) {
		for (var currentColumn = 0; currentColumn <=4; ++currentColumn) {
			var currentX = dataFrames.get(currentRow,currentColumn, 0);
			var shiftedX = currentX + horizontalShift;
			shiftedX = 1 - shiftedX;
			dataFrames.set(currentRow, currentColumn, 0, shiftedX);
		}
	}

	//4th Sheet - x2
	for (currentRow = 0; currentRow <= 5; ++currentRow) {
		for (currentColumn = 0; currentColumn <=4; ++currentColumn) {
			currentX = dataFrames.get(currentRow,currentColumn, 3);
			shiftedX = currentX + horizontalShift;
			shiftedX = 1 - shiftedX;
			dataFrames.set(currentRow, currentColumn, 3, shiftedX);
		}
	}
}

//Train
function train() {

	for (var i = 0; i < 2; i++) {

		//0 = Air
		features = air1.pick(null,null,null,i);
		features = centerData(features);
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

		//1 = Fire
		features = fire1.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire2.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire3.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire4.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire5.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);
		features = fire6.pick(null,null,null,i);
		features = centerData(features);
		knnClassifier.addExample(features.tolist(), 1);

	}

	trainingCompleted = true;
}

//Test
function test() {

	//Extract ith 3D Tensor
	currentTestingSample = framesOfData.clone();//.pick(null, null, null, null); // //
	// console.log(currentTestingSample.toString());

	//Center Data
	centerXData(currentTestingSample);
	centerYData(currentTestingSample);
	centerZData(currentTestingSample);

	// console.log(currentTestingSample.toString(),"DIV:",framesOfData.toString());

	//Reshape into 120 item 2D vector
	currentTestingSample = currentTestingSample.reshape(120, 1);

	try {
		//Classify //currentPrediction =
		knnClassifier.classify(currentTestingSample.tolist(),GotResults);
		// currentPrediction = parseInt(currentPrediction);

		//Increment
		++numPredictions;

		/* m = (n − 1)m + (c == d) / n */
		predictionAccuracyAverage = (((numPredictions - 1)*predictionAccuracyAverage) + (currentPrediction === itemToPredict)) / numPredictions;

		//Log accuracy
		// console.log(numPredictions, predictionAccuracyAverage, currentPrediction);
	} catch {
		console.log("knn error");
	}


}

//Got Results
function GotResults(err, result) {

	//console.log("PREDICTED LABEL: ", parseInt(result.label)); //"INDEX: ",testingSampleIndex,
	currentPrediction = parseInt(result.label);

	if (parseInt(result.label) == 0) {
		element = 0;
	}

	//print label:
	console.log("PREDICTION: ", currentPrediction);

	//Return it
	return(parseInt(result.label));
}

//Handle Frame
function HandleFrame(frame) {

	//Num hands
	var handCount = frame.hands.length;

	//data on hands
	var hand1 = frame.hands[0];
	var hand2 = frame.hands[1];

	//Interaction Box
	var interactionBox = frame.interactionBox;

	HandleHand(hand1, handCount, interactionBox);
	HandleHand(hand2, handCount, interactionBox);
}

//Handle Hand
function HandleHand(hand, handCount, interactionBox) {

	//fingers
	try {
		var fingers = hand.fingers; //fingers in first hand

		// each finger TAKEN FROM:
		// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.fingers[], much easier for loop to work with.

		//From distal to metacarpal,
		for (var phalangeNum = 4; phalangeNum >= 0; phalangeNum--) {

			//From thumb to pinky
			for (var fingerNum = 0; fingerNum <= 4; fingerNum++) {
				HandleBone(fingers[fingerNum].bones[phalangeNum], handCount, fingerNum, interactionBox);
			}
		}

	} catch(err) {
		//console.log("Fingers failed");
	}

}

//Handle Bone
function HandleBone(bone, handCount, fingerIndex, interactionBox) {

	try {

		//Normalize point w/ interaction box
		var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
		//console.log("Prev:",normalizedPrevJoint.toString());

		var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
		//console.log("Next:",normalizedNextJoint.toString());

		//Save coordinates to vars
		var x1 = normalizedPrevJoint[0];
		var y1 = normalizedPrevJoint[1];
		var z1 = normalizedPrevJoint[2];
		var x2 = normalizedNextJoint[0];
		var y2 = normalizedNextJoint[1];
		var z2 = normalizedNextJoint[2];

		//Record to arrays
		row = fingerIndex;
		col = bone.type;
		framesOfData.set(row, col, 0, x1);
		framesOfData.set(row, col, 1, y1);
		framesOfData.set(row, col, 2, z1);
		framesOfData.set(row, col, 3, x2);
		framesOfData.set(row, col, 4, y2);
		framesOfData.set(row, col, 5, z2);
		
		/*//CALL TEST AFTER FRAME RECORDED && ONE+ HAND OVER SENSOR
		if (programState === 2) {
			// console.log("TEST: ", framesOfData.toString());
			test();
		}*/

		//**MAKE SURE TRANSFORM HAPPENS AFTER DATA IS RECORDED**
		//Scale new points to canvas
		var canvasX1 = window.innerWidth * x1;
		var canvasY1 = window.innerHeight * (1 - y1);
		var canvasX2 = window.innerWidth * x2;
		var canvasY2 = window.innerHeight * (1 - y2);

		//Z min and max
		var rawZmax = 200;
		var rawZmin = -200

		//Stroke thickness
		var strokeWeightMax = 50;
		var zStrokeWeight = ((bone.prevJoint[2] - rawZmin) * strokeWeightMax) / (rawZmax - rawZmin);

		//Bone segment number
		var boneType = bone.type;

		/*var red = (1 - predictionAccuracyAverage) * 255;
		var blue = predictionAccuracyAverage * 255;
		// console.log("RED: ", red, " GREEN: ", green);

		//Hands always grey, regardless of count
		if (boneType === 0) {
			stroke(red,  blue, 100);
		} else if (boneType === 1) {
			stroke(red,  blue, 75);
		} else if (boneType === 2) {
			stroke(red, blue,  50);
		} else if (boneType === 3) {
			stroke(red, blue,  25);
		}*/

		//GREEN IF 1 HAND
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

			//RED IF 2 HANDS
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

		}

		strokeWeight(zStrokeWeight/5);

		line(canvasX1,canvasY1,canvasX2,canvasY2);

		//Handle Element
		if (element === 0) {

		}
	}
	catch(err) {
		//console.log("Drawing line failed");
	}

}

/*function HandIsTooFarToTheLeft() {

	// console.log(framesOfData.toString());
	var xValues = framesOfData.slice([],[],[0,6,3]);

	//Get mean of xValues
	var currentMean = xValues.mean();

	//If the mean is past the 25% mark on the left, return true, else false
	//console.log("X: ", currentMean);

	return currentMean < 0.25;
}
function HandIsTooFarToTheRight() {

	// console.log(framesOfData.toString());
	var xValues = framesOfData.slice([],[],[0,6,3]);

	//Get mean of xValues
	var currentMean = xValues.mean();

	//console.log("X: ", currentMean);

	return currentMean > 0.75;
}
function HandIsTooFarUp() {

	// console.log(framesOfData.toString());
	var yValues = framesOfData.slice([],[],[1,6,4]);

	//Get mean of yValues
	var currentMean = yValues.mean();

	//console.log("Y: ", currentMean);

	return currentMean > 0.75;
}
function HandIsTooFarDown() {

	// console.log(framesOfData.toString());
	var yValues = framesOfData.slice([],[],[1,6,4]);

	//Get mean of yValues
	var currentMean = yValues.mean();

	//console.log("Y: ", currentMean);

	return currentMean < 0.25;
}
function HandIsTooClose() {

	// console.log(framesOfData.toString());
	var zValues = framesOfData.slice([],[],[2,6,5]);

	//Get mean of zValues
	var currentMean = zValues.mean();

	//console.log("Z: ", currentMean);

	return currentMean > 0.75;

}
function HandIsTooFarForward() {

	// console.log(framesOfData.toString());
	var zValues = framesOfData.slice([],[],[2,6,5]);

	//Get mean of zValues
	var currentMean = zValues.mean();

	//console.log("Z: ", currentMean);

	return currentMean < 0.25;
}*/

/*function drawArrow(arrow) {
	image(arrow, window.innerWidth * .75, 0, window.innerWidth, window.innerHeight * .25);
}

function drawArrowRight() {
	drawArrow(arrowRight);
}
function drawArrowLeft() {
	drawArrow(arrowLeft);
}
function drawArrowUp() {
	drawArrow(arrowUp);
}
function drawArrowDown() {
	drawArrow(arrowDown);
}
function drawArrowAway() {
	drawArrow(arrowAway);
}
function drawArrowTorward() {
	drawArrow(arrowToward);
}

function HandIsUncentered() {

	// console.log("Checking centering...");

	//Hand Not Cenetered Cases
	if (HandIsTooFarToTheLeft()) {
		drawArrowRight();
		return true;
	}
	else if (HandIsTooFarToTheRight()) {
		drawArrowLeft();
		return true;
	}
	else if (HandIsTooFarUp()) {
		drawArrowDown();
		return true;
	}
	else if (HandIsTooFarDown()) {
		drawArrowUp();
		return true;
	}
	else if (HandIsTooClose()) {
		drawArrowAway();
		return true;
	}
	else if (HandIsTooFarForward()) {
		drawArrowTorward();
		return true;
	}

	//If pass all, return false
	return false;
}*/

function TrainKNNIfNotDoneYet() {
	if (trainingCompleted === false) {
		train();
	}
}

/*function InitializeScorePerDigit(){
	if (scoresInitialized === false) {
		for (var i = 0; i < 10; i++) {
			scorePerDigit.set(i,i);
		}
		// console.log("Score array init: ", scorePerDigit.toString());
	}
	scoresInitialized = true;
}*/

/*function DrawImageToHelpUserPutTheirHandOverTheDevice() {
	image(img,0,0,window.innerWidth/2,window.innerHeight/2);
}



function DrawLowerRightPanel() {

	//Level zero  = Easy
	if (difficulty < 1) {
		if (itemToPredict == 0) {
			image(signZero, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 1) {
			image(signOne, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 2) {
			image(signTwo, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 3) {
			image(signThree, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 4) {
			image(signFour, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 5) {
			image(signFive, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 6) {
			image(signSix, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 7) {
			image(signSeven, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 8) {
			image(signEight, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 9) {
			image(signNine, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
		}
	}

	//Level one = medium
	else if (difficulty == 1) {
		if (itemToPredict == 0) {
			image(altSignZero, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 1) {
			image(altSignOne, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 2) {
			image(altSignTwo, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 3) {
			image(altSignThree, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 4) {
			image(altSignFour, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 5) {
			image(altSignFive, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 6) {
			image(altSignSix, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 7) {
			image(altSignSeven, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 8) {
			image(altSignEight, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 9) {
			image(altSignNine, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
		}
	}

	//Level two = hot dogs
	else {
		if (itemToPredict == 0) {
			image(altSignZeroHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 1) {
			image(altSignOneHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 2) {
			image(altSignTwoHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 3) {
			image(altSignThreeHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 4) {
			image(altSignFourHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 5) {
			image(altSignFiveHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 6) {
			image(altSignSixHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 7) {
			image(altSignSevenHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 8) {
			image(altSignEightHOTDOG, window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight);
		} else if (itemToPredict == 9) {
			image(altSignNineHOTDOG, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
		}
	}
}

function DetermineWhetherToSwitchDigits() {
	if (TimeToSwitchDigits()) {
		SwitchDigits();
	}
}

function TimeToSwitchDigits() {
	currentTime = new Date();
	timeChangeInMilliseconds = currentTime - timeSinceLastDigitChange;
	timeChangeInSeconds = timeChangeInMilliseconds/1000;
	// console.log(timeChangeInSeconds);
	return timeChangeInSeconds > signTimeLimit;
}

function analyzeUserResults() {
	for (var i = 0; i < 10; i++) {
		//Find minimum (worst score) in array
		if (scorePerDigit.get(i) == scorePerDigit.min()) {
			//Set the respective digit as the next digit to show
			itemToPredict = i;
			//console.log("MIN: ", scorePerDigit.min());
			//console.log("Next Worst Digit: ", itemToPredict);
		}
	}

	//If all the items are 100, reset them to 99 for switching's sake
	if (scorePerDigit.min() == 100) {
		for (var i = 0; i < 10; i++) {
			scorePerDigit.set(i, 99);
		}
	}
}

function SwitchDigits() {

	//Calculate Score
	score = predictionAccuracyAverage * 100;

	//Print iiiitt
	console.log("DIGIT: ", itemToPredict,"| SCORE: ", score);

	//Add to respective score
	scorePerDigit.set(itemToPredict, score);
	console.log(scorePerDigit.toString());

	//ORDER IS: 0->1->...->9
	if (signedAllTen === false) {

		//Iterate digit
		itemToPredict += 1;
		//console.log("Signing: ", itemToPredict);

		//All ten have been signed, begin showing ones with the worst scores
		if (itemToPredict > 9) {

			//End bool
			signedAllTen = true;

			console.log("Completed first 10. Calculating worst digit...");

			//Check results
			analyzeUserResults();
		}
	}

	//After done all 10, always check results for next digit
	else {
		//Check results
		analyzeUserResults();
	}

	//reset vars
	timeSinceLastDigitChange = new Date();
	numPredictions = 0;


	//Add to average
	averageArray.set( averageArrayIndex, predictionAccuracyAverage);

	//Iterate Index
	averageArrayIndex += 1;

	//Reset to 0 if 10
	if (averageArrayIndex >= 10) {
		averageArrayIndex = 0;
		var meanScore = averageArray.sum() * 100/10;
		console.log("MEAN SCORE: ", meanScore);

		//Reduce time limit if good score.
		if (meanScore > 60) {

			// console.log("Mean score above 50%! Nice Job.");
			signTimeLimit -= 2; //(6->4->2->6)

			//If sign time limit hits zero, reset to default
			if (difficulty >= 3) { //signTimeLimit <= 0
				signTimeLimit = signTimeLimitDefault;
				console.log("YOU WIN!!! The end.");
				difficulty = 0;
				console.log("Difficulty: ", difficulty);
				console.log("You will only have", signTimeLimit, "seconds to sign.");
			}

			//Otherwise...
			else {
				console.log("Mean score above 60%! Nice Job. Raising Difficulty...");
				difficulty += 1;
				console.log("Difficulty: ", difficulty);
				console.log("You will only have", signTimeLimit, "seconds to sign.");

				//HOT DOG TIME
				if (difficulty > 1) {
					console.log("IT'S HOT DOG TIME");
					console.log("IT'S HOT DOG TIME");
					console.log("IT'S HOT DOG TIME");
					console.log("IT'S HOT DOG TIME");
					console.log("IT'S HOT DOG TIME");
				}
			}
		}

		//Reset signTimeLimit if fail
		else {
			signTimeLimit = signTimeLimitDefault;
			console.log("Trial FAILED! Resetting Difficulty...");
			difficulty = 0;
			console.log("Difficulty: ", difficulty);
			console.log("You will have", signTimeLimit, "seconds to sign.");
		}
	}

	//averageArrayIndex = 0;
}

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
	console.log(username);

	var list = document.getElementById('users');

	//New User
	if (IsNewUser(username,list)) {
		CreateNewUser(username,list);
		CreateSignInItem(username,list);
	}
	else {
		ID = String(username) + "_signins";
		listItem = document.getElementById( ID );
		listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
	}

	console.log("list: ", list.innerHTML); //innerHTML

	// console.log("Users: ", users);

	return false;
}*/

//No Hands
function HandleState0(frame) {
	TrainKNNIfNotDoneYet();
	// InitializeScorePerDigit();
	// DrawImageToHelpUserPutTheirHandOverTheDevice();
}

//Determine State
function DetermineState(frame) {

	//Num hands
	var handCount = frame.hands.length;

	//If no hands
	if (handCount === 0) {
		programState = 0;
	}

	//If 1 hand
	else if (handCount === 1) {
		programState = 1;
	}

	//If 2 hands
	else {
		programState = 2;
	}

}

//Hand Uncentered
function HandleState1(frame) {
	//Draw hands
	HandleFrame(frame);
	test();
}

//Hand Centered
function HandleState2(frame) {
	//Draw hands
	HandleFrame(frame);
	test();
	/*DrawLowerRightPanel();
	DetermineWhetherToSwitchDigits();*/
}

//LEAP TIME
Leap.loop(controllerOptions, function(frame) {
	//Exception just so we don't crash on error
	try {
		clear();

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
