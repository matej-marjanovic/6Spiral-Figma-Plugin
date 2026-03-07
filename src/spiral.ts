export const SPIRAL_CONSTANTS = {
  SPIRAL_TYPE_ARCHIMEDEAN: 0,
  SPIRAL_TYPE_LOGARITHIMIC: 1
};

export function makeSpiralPoints(data: any) {
  const currentSpiralType = parseInt(data.currentSpiralType);

  let innerR = Math.max(parseInt(data.innerRadius), 0);
  if (currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
    innerR = 1;
  }
  let outerR = Math.max(parseInt(data.outerRadius), 1.0);

  // Inner and Outer Radius also can't both be 0 for archimedean spiral.
  // Setting both to 0 erases the shape and plugin needs to be restarted.
  // Forcing outerR to 1.0 if both InnerR and outerR are set to 0 to prevent this issue.
  if (innerR == 0 && outerR == 0) {
    outerR = 1.0;
  }

  const degrees = Math.max(parseInt(data.degrees), 1);
  const points = Math.max(parseInt(data.points), 2);
  const numQCoordinates = points * 2;

  const shouldMakeHelix = data.shouldMakeHelix;
  const shouldAdjustHelixHeight = data.shouldAdjustHelixHeight;
  const helixOffsetX = parseFloat(data.helixOffsetX);
  let helixOffsetY = parseFloat(data.helixOffsetY);
  const helixHWRatio = parseFloat(data.helixHWRatio);
  const helixIsoAngle = parseFloat(data.helixIsoAngle);

  if (shouldAdjustHelixHeight) {
    helixOffsetY = helixOffsetY * Math.sin(helixIsoAngle * (Math.PI / 180));
  }

  const helixPointOffsetX = helixOffsetX / points;
  const helixPointOffsetY = helixOffsetY / points;

  const pointDistanceIncrement = (outerR - innerR) / numQCoordinates;
  const pointsArr = [];

  let maxExtent = outerR; // initialize with outerR since it will be at least that wide in one direction

  // two x, y pairs are needed to define one point on the Q bezier curve.
  if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN) {
    for (let i = 0; i <= numQCoordinates; i++) {
      const bezierCoordinateLength = innerR + i * pointDistanceIncrement;

      const bezierCoordinateAngle = i * (degrees / numQCoordinates);
      let pointX = bezierCoordinateLength * Math.cos(bezierCoordinateAngle * (Math.PI / 180));
      let pointY = bezierCoordinateLength * Math.sin(bezierCoordinateAngle * (Math.PI / 180));

      if (shouldMakeHelix) {
        pointY = pointY * helixHWRatio;
        pointY = pointY + i * helixPointOffsetY;
        pointX = pointX + i * helixPointOffsetX;
      }

      maxExtent = Math.max(maxExtent, Math.abs(pointX), Math.abs(pointY));
      pointsArr.push(pointX + " " + pointY);
    }
    return { path: "M " + pointsArr.shift() + " Q " + pointsArr.join(" "), maxExtent };

  } else if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
    // For Log Spiral, inner radius can't be 0 (log spiral only approaches, never reaches 0).
    const a_log = innerR;
    const b_log = (Math.log(outerR / innerR)) / (2 * Math.PI * (degrees / 360.0));
    const degrees_per_point_log = degrees / numQCoordinates;
    const radians_per_point_log = degrees_per_point_log * (Math.PI / 180);

    for (var i = 0; i <= numQCoordinates; i++) {
      const pointAngleDeg = i * degrees_per_point_log;
      const pointAngleRad = i * radians_per_point_log;
      const pointLength = a_log * Math.pow(Math.E, b_log * pointAngleRad);
      let pointX = pointLength * Math.cos(pointAngleDeg * (Math.PI / 180));
      let pointY = pointLength * Math.sin(pointAngleDeg * (Math.PI / 180));

      if (shouldMakeHelix) {
        pointY = pointY * helixHWRatio;
        pointY = pointY + i * helixPointOffsetY;
        pointX = pointX + i * helixPointOffsetX;
      }

      maxExtent = Math.max(maxExtent, Math.abs(pointX), Math.abs(pointY));
      pointsArr.push(pointX + " " + pointY);
    }
    return { path: "M " + pointsArr.shift() + " Q " + pointsArr.join(" "), maxExtent };
  }

  return { path: "", maxExtent: 0 };
}
