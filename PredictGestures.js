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
var element = -1;

//Time
var timeSinceLastChange = new Date();
var timeLimit = 5;

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

	}

	trainingCompleted = true;
}

// Test
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

// Got Results
function GotResults(err, result) {

	// console.log("PREDICTED LABEL: ", parseInt(result.label)); // "INDEX: ",testingSampleIndex,
	currentPrediction = parseInt(result.label);

	if (parseInt(result.label) == 0) {
		element = 0;
	}

	else if (parseInt(result.label) == 1) {
		element = 1;
	}

	// print label:
	console.log("PREDICTION: ", currentPrediction);

	// Return it
	return(parseInt(result.label));
}

// Handle Frame
function HandleFrame(frame) {

	// Num hands
	var handCount = frame.hands.length;

	// data on hands
	var hand1 = frame.hands[0];
	var hand2 = frame.hands[1];

	// Interaction Box
	var interactionBox = frame.interactionBox;

	HandleHand(hand1, handCount, interactionBox);
	HandleHand(hand2, handCount, interactionBox);
}

// Handle Hand
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

// Handle Bone
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

		// GREEN IF 1 HAND
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

		}

		strokeWeight(zStrokeWeight/5);

		line(canvasX1,canvasY1,canvasX2,canvasY2);

		HandleElement(bone, handCount, fingerIndex, interactionBox);
	}
	catch(err) {
		// console.log("Drawing line failed");
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

function Timer() {
	currentTime = new Date();
	timeChangeInMilliseconds = currentTime - timeSinceLastChange;
	timeChangeInSeconds = timeChangeInMilliseconds/1000;
	return timeChangeInSeconds > timeLimit;
}

function HandleElement(bone, handCount, fingerIndex, interactionBox) {
	try {
		//Set Vars
		textSize(32);
		var diameter = 30;

		// Handle Element
		// Air = 0
		if (element === 0) {

			//If bone is tip of middle finger
			if (fingerIndex === 2 && boneType === 3) {

				//Color = Light Grey
				stroke('rgb(214, 214, 214)');
				fill('rgb(214, 214, 214)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 + 200, diameter);

				//Write text
				strokeWeight(1);
				text('Air', 100, 100);
			}
		}

		//Fire = 1
		else if (element === 1) {

			//If bone is 1st knuckle of middle finger
			if (fingerIndex === 2 && boneType === 1) {

				//Color = Red Orange
				stroke('rgb(252, 104, 40)');
				fill('rgb(252, 104, 40)');

				//Draw a circle that appears to be in front of hand, hopefully
				circle(canvasX1, canvasY1 - 20, diameter);

				//Write text
				strokeWeight(1);
				text('Fire', 100, 100);

				//SCALE LOCATION
				// newCoordinate = ((oldCoordinate - newMin) * factorToScaleBy) / (newMax - newMin);
				var elementX = ((canvasX1 - 0) * 1) / (window.innerWidth - 0);
				var elementY = ((canvasY1 - 0) * 1) / (window.innerHeight - 0);

				//Draw a circle that appears to be in front of hand, hopefully
				circle(elementX, elementY, diameter);
				// console.log("X: ", canvasX1, "Y: ", canvasY1);
			}
		}
	}
	catch(err) {

	}

}

function TrainKNNIfNotDoneYet() {
	if (trainingCompleted === false) {
		train();
	}
}

// No Hands
function HandleState0(frame) {
	TrainKNNIfNotDoneYet();
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

// LEAP TIME
Leap.loop(controllerOptions, function(frame) {
	// Exception just so we don't crash on error
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
