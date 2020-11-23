controllerOptions = {};
var i = 0;

//Force printing of long arrays
nj.config.printThreshold = 1000;

//Establish vars
var currentNumHands = 0;
var previousNumHands = 0;
var numSamples = 100;
var oneFrameOfData = nj.zeros([5,4]);
var framesOfData = nj.zeros([5,4,6,numSamples]); //, numSamples
var currentSample = 0;

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

		//Set sum of all xyz coords as the data for the current finger @ index
		//var coordinateSum = (x1 + y1 + z1 + x2 + y2 + z2);
		var row = fingerIndex;
		var col = bone.type;
		oneFrameOfData.set(row, col, x1);
		oneFrameOfData.set(row, col, y1);
		oneFrameOfData.set(row, col, z1);
		oneFrameOfData.set(row, col, x2);
		oneFrameOfData.set(row, col, y2);
		oneFrameOfData.set(row, col, z2);

		framesOfData.set(row, col, 0, currentSample, x1);
		framesOfData.set(row, col, 1, currentSample, y1);
		framesOfData.set(row, col, 2, currentSample, z1);
		framesOfData.set(row, col, 3, currentSample, x2);
		framesOfData.set(row, col, 4, currentSample, y2);
		framesOfData.set(row, col, 5, currentSample, z2);

		//**MAKE SURE TRANSFORM HAPPENS AFTER DATA IS RECORDED**
		//Scale new points to canvas
		var canvasX1 = window.innerWidth * x1;
		var canvasY1 = window.innerHeight * (1 - y1);
		var canvasX2 = window.innerWidth * x2;
		var canvasY2 = window.innerHeight * (1 - y2);

		//Transform Coords to fit Window
		/*var baseCoords = TransformCoordinates(bone.prevJoint[0],bone.prevJoint[1]);
		var tipCoords = TransformCoordinates(bone.nextJoint[0],bone.nextJoint[1]);
		var x1 = baseCoords[0];
		var y1 = baseCoords[1];
		var x2 = tipCoords[0];
		var y2 = tipCoords[1];*/

		//console.log("Row:", row, "Col:", col, "Sum:", coordinateSum);

		/*var strokeMax = 200;
		var strokeWeightMin = 10;
		var zStrokeDensity = 100 * ((bone.prevJoint[2] - rawZmin) * strokeMax) / (rawZmax - rawZmin);*/

		//Z min and max
		var rawZmax = 200;
		var rawZmin = -200

		//Stroke thickness
		var strokeWeightMax = 50;
		var zStrokeWeight = ((bone.prevJoint[2] - rawZmin) * strokeWeightMax) / (rawZmax - rawZmin);

		//Bone segment number
		var boneType = bone.type;

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

		strokeWeight(zStrokeWeight);

		line(canvasX1,canvasY1,canvasX2,canvasY2);
	}
	catch(err) {
		//console.log("Drawing line failed");
	}

}

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

function HandleFrame(frame) {
	try {
		clear();
	}
	catch(err) {
		//console.log("Clear did not work");
	}

	//Num hands
	var handCount = frame.hands.length;

	//data on first hand
	var hand = frame.hands[0];

	//Interaction Box
	var interactionBox = frame.interactionBox;

	HandleHand(hand, handCount, interactionBox);
}

function RecordData() {
	if (previousNumHands === 2 && currentNumHands === 1) {
		// Capture the data when you go from 2 hands to 1 hand
		console.log( framesOfData.toString()); //.pick(null,null,null,0)
		background(51);
	}

//Check if 2 hands

	//Reset to zero if equal to num samples
	if (currentNumHands === 2) {

		//Increment Current Sample Count
		currentSample++;
		if (currentSample === numSamples) {
			currentSample = 0;
		}
	}


	//console.log(currentSample);

}

Leap.loop(controllerOptions, function(frame)
{
	// # of hands in the current frame
	currentNumHands = frame.hands.length;

	//Draw hands
	HandleFrame(frame);

	// Capture the data when you go from 2 hands down to 1 hand
	RecordData();

	// # of hands in the previous frame
	previousNumHands = frame.hands.length;

}
);