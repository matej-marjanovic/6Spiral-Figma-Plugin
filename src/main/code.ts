const SPIRAL_CONSTANTS = {
	SPIRAL_TYPE_ARCHIMEDEAN: 0,
	SPIRAL_TYPE_LOGARITHIMIC: 1
  };

// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many of the chose shape on screen

// This shows the HTML page in "index.html".
figma.showUI(__html__, {width: 400, height: 620 });

let svgPath: any = false;

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "create-shapes" || msg.type === "create-spiral") {

      const pathDAttribute = makeSpiralPoints(msg.type === "create-shapes" ?
        { innerRadius: 10,
          outerRadius: 100,
          degrees: 720,
          points: 48,
          lineWidth: 1,
          shouldMakeHelix: false,
          shouldAdjustHelixHeight: false,
          helixOffsetX: 0,
          helixOffsetY: 0,
          helixHWRatio: 0,
          helixIsoAngle: 0
         } : msg.data
      );

	  if (svgPath) {
		svgPath.remove();
	  }
      svgPath = figma.createNodeFromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathDAttribute}" fill="none" stroke="black" stroke-width="${msg.data.lineWidth}px"/> </svg>`
      );
	  
	  if (figma.currentPage.selection.length > 0) {
		const n0 = figma.currentPage.selection[0]
		const spiralXOffset = svgPath.x;
		const spiralYOffset = svgPath.y;
		const centerX = n0.x + n0.width/2 + spiralXOffset;
		const centerY = n0.y + n0.height/2 + spiralYOffset;
		svgPath.x = centerX;
		svgPath.y = centerY;
	  }

    //   figma.currentPage.appendChild(svgPath);
      
    } else if (msg.type === "close" || msg.type === "done") {
		figma.closePlugin();
	}
  };


  function makeSpiralPoints(data: any) {
	const currentSpiralType = parseInt(data.currentSpiralType);

	let innerR = Math.max(parseInt(data.innerRadius), 0);
	if (currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
		innerR = 1;
	}
	let outerR = Math.max(parseInt(data.outerRadius), 1.0);

	// Inner and Outer Radius also can't both be 0 for archimedean spiral.
	// Setting both to 0 erases the shape and plugin needs to be restarted.
	// Forcing outerR to 1.0 if both InnerR and outerR are set to 0 to prevent this issue.
	if(innerR == 0 && outerR == 0) {
		outerR = 1.0;
	}

	const degrees = Math.max(parseInt(data.degrees),1);
	const points = Math.max(parseInt(data.points), 2);
	const numQCoordinates = points * 2;
	const lineWidth = parseFloat(data.lineWidth);

	const shouldMakeHelix = data.shouldMakeHelix;
	const shouldAdjustHelixHeight = data.shouldAdjustHelixHeight;
	const helixOffsetX = parseFloat(data.helixOffsetX);
	let helixOffsetY = parseFloat(data.helixOffsetY);
	const helixHWRatio = parseFloat(data.helixHWRatio);
	const helixIsoAngle = parseFloat(data.helixIsoAngle);

	if (shouldAdjustHelixHeight) {
	  helixOffsetY = helixOffsetY * Math.sin(helixIsoAngle * (Math.PI / 180));
	}
  
	const helixPointOffsetX = helixOffsetX/points;
	const helixPointOffsetY = helixOffsetY/points;
  
	const pointDistanceIncrement = (outerR - innerR)/(numQCoordinates);
	const pointsArr = [];
	// two x, y pairs are needed to define one point on the Q bezier curve.
	if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN) {
		for (let i = 0; i <= numQCoordinates; i++) {

		
		const bezierCoordinateLength = innerR + i * pointDistanceIncrement;
	
		// var zigZag = false;
		// var lengthChange = 0;
		// if (zigZag) {
		//   var lengthChange = pointLength / 10;
		//   if (i % 2 == 1) {
		//     lengthChange = -pointLength / 10;
		//   }
		// }
		// var centerToPointLength = Math.sqrt(pointX*pointX+pointY*pointY); // length is defined.
		// var centerToPointNormalVectorX = pointX / centerToPointLength;
		// var centerToPointNormalVectorY = pointY / centerToPointLength;
	
		const bezierCoordinateAngle = i * (degrees/(numQCoordinates));
		let pointX = bezierCoordinateLength * Math.cos(bezierCoordinateAngle * (Math.PI / 180));
		let pointY = bezierCoordinateLength * Math.sin(bezierCoordinateAngle * (Math.PI / 180));

	
		if(shouldMakeHelix) {
			pointY = pointY * helixHWRatio;
			pointY = pointY + i * helixPointOffsetY;
			pointX = pointX + i * helixPointOffsetX;
		}
		pointsArr.push(pointX + " " + pointY);
		}
		return "M " + pointsArr.shift() + " Q " + pointsArr.join(" ");

	} else if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {

		// For Log Spiral, inner radius can't be 0 (log spiral only approaches, never reaches 0). 
		const a_log = innerR;
		const b_log = (Math.log(outerR/innerR))/(2*Math.PI*(degrees/360.0));
		const degrees_per_point_log = degrees/numQCoordinates;
		const radians_per_point_log = degrees_per_point_log * (Math.PI/180);
	
		for (var i = 0; i <= numQCoordinates; i++) {
		  const pointAngleDeg = i * degrees_per_point_log;
		  const pointAngleRad = i * radians_per_point_log;
		  const pointLength =  a_log * Math.pow(Math.E, b_log*pointAngleRad);
		  let pointX = pointLength * Math.cos(pointAngleDeg * (Math.PI / 180));
		  let pointY = pointLength * Math.sin(pointAngleDeg * (Math.PI / 180));
	
		  if(shouldMakeHelix) {
			pointY = pointY * helixHWRatio;
			pointY = pointY + i * helixPointOffsetY;
			pointX = pointX + i * helixPointOffsetX;
		  }
	
		  pointsArr.push(pointX + " " + pointY);
		}
		return "M " + pointsArr.shift() + " Q " + pointsArr.join(" ");
	  }
  }