//vars
const updateSpiralButton = document.querySelector('#updateSpiralButton');
// const cancelButton = document.querySelector('#cancel');

//on load function
document.addEventListener("DOMContentLoaded", function() {
    sendSpiralDataToPlugin();
});

//initialize select menu
// from  Figma Plugin DS UI library
// selectMenu.init();

//event listeners
// countInput.oninput = () => { formValidation(); }
// shapeMenu.onchange = () => { formValidation(); }

updateSpiralButton.onclick = () => { sendSpiralDataToPlugin(); }
// updateSpiralButton.onclick = () => { createShapes(); }

// cancelButton.onclick = () => { cancel(); }

//form validation
var formValidation = function(event) {

    // if (shapeMenu.value === '' || countInput.value === '') {
    //     createShapesButton.disabled = true;
    // } else {
    //     createShapesButton.disabled = false;
    // }
}



//functions
function createShapes() {
    parent.postMessage({ pluginMessage: { 
        'type': 'create-shapes', 
    } }, '*');
}

function cancel() {
    parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
}









// Commented out so that it's possible to Right Click -> Inspect Element.
// Disable the context menu
// document.addEventListener("contextmenu", function(e) {
//     e.preventDefault();
//   });
  
  const SPIRAL_CONSTANTS = {
    SPIRAL_TYPE_ARCHIMEDEAN: 0,
    SPIRAL_TYPE_LOGARITHIMIC: 1
  };
  
  var debugLogFlag = true;
  
  
  var currentSpiralType = SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN;
  
  var spiralType = document.getElementById('spiralType')
  var innerR = document.getElementById('InnerRadius');
  var outerR = document.getElementById('OuterRadius');
  var degrees = document.getElementById('Degrees');
  var rotations = document.getElementById('Rotations');
  var points = document.getElementById('Points');
  var lineWidth = document.getElementById('lineWidth');
  var spiralGapLabel = document.getElementById('SpiralGapLabel');
  var degreeIncrementLabel = document.getElementById('DegreeIncrementLabel');
  var minLogRadiusWarnLabel = document.getElementById('minLogRadiusWarnLabel');
  var minArchimedeanRadiusWarnLabel = document.getElementById('minArchimedeanRadiusWarnLabel');
  
  var shouldMakeHelixCheckbox = document.getElementById('helixCheckbox');
  var helixAdjustHeightCheckbox = document.getElementById('helixAdjustHeightCheckbox');
  var helixOffsetX = document.getElementById('xOffset');
  var helixOffsetY = document.getElementById('yOffset');
  var helixHWRatio = document.getElementById('helixHWRatio');
  var helixIsoAngle = document.getElementById('helixIsoAngle');
  
  var continouslyUpdateCheckbox = document.getElementById('continouslyUpdateCheckbox');
//   var updateSpiralButton = document.getElementById('updateSpiralButton');
  var closePanelButton = document.getElementById('closePanel');
  closePanelButton.onclick = () => {
    parent.postMessage({ pluginMessage: { 
        'type': 'done', 
    } }, '*');
   }
  
  
  var minPointsText = "";
  var minDegreesText = "";
  
  
  spiralType.addEventListener('change', function(evt) {
    if (this.value == "Archimedean Spiral") {
      currentSpiralType = SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN;
    } else if (this.value == "Logarithmic Spiral") {
      currentSpiralType = SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC;
    }
    setSpiralGapLabel();
    setSpiralMinRadiusWarningLabels();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  
  innerR.addEventListener('input', function (evt) {
    setSpiralGapLabel();
    setSpiralMinRadiusWarningLabels();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  outerR.addEventListener('input', function (evt) {
    setSpiralGapLabel();
    setSpiralMinRadiusWarningLabels();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  rotations.addEventListener('input', function (evt) {
    debugLog(this.value);
    degrees.value = this.value*360;
    if(degrees.value < 1.0) {
      minDegreesText = "(min rotation is 1°)";
    } else {
      minDegreesText = "";
    }
  
    setDegreeIncrementLabel();
    setSpiralGapLabel();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  degrees.addEventListener('input', function (evt) {
    debugLog(this.value);
    rotations.value = this.value/360;
    if(degrees.value < 1.0) {
      minDegreesText = " - USING ROTATION of 1°";
    } else {
      minDegreesText = "";
    }
    setDegreeIncrementLabel();
    setSpiralGapLabel();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  points.addEventListener('input', function (evt) {
    debugLog(this.value);
    if(this.value<2) {
      minPointsText = " - USING 2 POINTS";
    } else {
      minPointsText = "";
    }
  
    setDegreeIncrementLabel();
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  lineWidth.addEventListener('input', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  continouslyUpdateCheckbox.addEventListener('click', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiralButton.disabled = true;
      updateSpiralButton.classList.add("disabled");
      debugLog("Button disabled");
      updateSpiral();
    } else {
      updateSpiralButton.disabled = false;
      updateSpiralButton.classList.remove("disabled");
      debugLog("Button enabled");
    }
  });
  
  helixOffsetX.addEventListener('input', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  helixOffsetY.addEventListener('input', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  helixHWRatio.addEventListener('input', function (evt) {
    debugLog(this.value);
    helixIsoAngle.value = ((Math.acos(this.value))*(180 / Math.PI)).toFixed(1);
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  helixIsoAngle.addEventListener('input', function (evt) {
    debugLog(this.value);
    helixHWRatio.value = Math.cos(this.value * (Math.PI / 180)).toFixed(3);
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
//   updateSpiralButton.addEventListener('click',function(){
//     debugLog('SPIRAL DEBUG // Spiral Button Clicked');
//     updateSpiral();
//     return false;
//   });
  
  shouldMakeHelixCheckbox.addEventListener('click', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  helixAdjustHeightCheckbox.addEventListener('click', function (evt) {
    if(continouslyUpdateCheckbox.checked) {
      updateSpiral();
    }
  });
  
  
  function setDegreeIncrementLabel() {
    var degreeIncrement = degrees.value/(Math.floor(points.value));
    degreeIncrementLabel.innerHTML = "Point every " + degreeIncrement.toFixed(2) + " degrees" + minPointsText + minDegreesText;;
  }
  
  function setSpiralGapLabel() {
    if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN) {
      var spiralGap = Math.abs(outerR.value - innerR.value) / rotations.value;
      spiralGapLabel.innerHTML = "Gap of " + spiralGap.toFixed(2) + " after each rotation of the spiral";
    }
    else if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
      var log_spiral_param_a = parseFloat(innerR.value);
      var log_spiral_param_b = (Math.log(outerR.value/innerR.value))/(2*Math.PI*rotations.value);
      spiralGapLabel.innerHTML = "Log spiral equation: a*e^(b*theta) -> a=" + log_spiral_param_a + "  theta=" + log_spiral_param_b.toFixed(4);
    }
  }
  
  function setSpiralMinRadiusWarningLabels() {
    if(currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
      if(Math.round(innerR.value)<1.0 || Math.round(outerR.value)<1.0) {
        minLogRadiusWarnLabel.hidden = false;
      } else {
        minLogRadiusWarnLabel.hidden = true;
      }
    } else {
      minLogRadiusWarnLabel.hidden = true;
  
      if (innerR.value == 0.0 && outerR.value == 0.0) {
        minArchimedeanRadiusWarnLabel.hidden = false;
      } else {
        minArchimedeanRadiusWarnLabel.hidden = true;
      }
  
    }
  }
  
  function updateSpiral() {
    sendSpiralDataToPlugin()
  }
  
  function sendSpiralDataToPlugin() {
    // Create JSON object with the action we want to trigger and the current UNIX date
    var data = {
      "currentSpiralType": currentSpiralType,
      "innerRadius": Math.round(innerR.value),
      "outerRadius": Math.round(outerR.value),
      "degrees": Math.round(degrees.value),
      "points": Math.round(points.value),
      "lineWidth": lineWidth.value,
      "shouldMakeHelix": shouldMakeHelixCheckbox.checked,
      "shouldAdjustHelixHeight": helixAdjustHeightCheckbox.checked,
      "helixOffsetX": helixOffsetX.value,
      "helixOffsetY": helixOffsetY.value,
      "helixHWRatio": helixHWRatio.value,
      "helixIsoAngle": helixIsoAngle.value,
      "date": new Date().getTime()
    }
    debugLog(data);
    
    parent.postMessage({ pluginMessage: { 
        'type': 'create-spiral', data
    } }, '*');
  }
  
  
  function debugLog(msg) {
    if (debugLogFlag) {
      console.log(msg);
    }
  }