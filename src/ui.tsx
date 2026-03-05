import { render, Container, Text, TextboxNumeric, Toggle, Dropdown, Button, VerticalSpace, Checkbox } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import '!./output.css';

const SPIRAL_CONSTANTS = {
  SPIRAL_TYPE_ARCHIMEDEAN: 0,
  SPIRAL_TYPE_LOGARITHIMIC: 1
};

function Plugin() {
  const [spiralType, setSpiralType] = useState('Archimedean Spiral');
  const [innerRadius, setInnerRadius] = useState<string>('100');
  const [outerRadius, setOuterRadius] = useState<string>('300');
  const [degrees, setDegrees] = useState<string>('720');
  const [rotations, setRotations] = useState<string>('2');
  const [points, setPoints] = useState<string>('50');
  const [lineWidth, setLineWidth] = useState<string>('5');

  const [shouldMakeHelix, setShouldMakeHelix] = useState(false);
  const [shouldAdjustHelixHeight, setShouldAdjustHelixHeight] = useState(false);
  const [helixOffsetX, setHelixOffsetX] = useState<string>('0');
  const [helixOffsetY, setHelixOffsetY] = useState<string>('200');
  const [helixIsoAngle, setHelixIsoAngle] = useState<string>('60');
  const [helixHWRatio, setHelixHWRatio] = useState<string>('0.500');

  const [continuouslyUpdate, setContinuouslyUpdate] = useState(true);

  // Derived state warnings
  const currentSpiralType = spiralType === 'Archimedean Spiral' ? SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN : SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC;

  const pInnerRadius = parseFloat(innerRadius) || 0;
  const pOuterRadius = parseFloat(outerRadius) || 0;
  const pDegrees = parseFloat(degrees) || 0;
  const pRotations = parseFloat(rotations) || 0;
  const pPoints = parseFloat(points) || 1;
  const pLineWidth = parseFloat(lineWidth) || 1;
  const pHelixOffsetX = parseFloat(helixOffsetX) || 0;
  const pHelixOffsetY = parseFloat(helixOffsetY) || 0;
  const pHelixIsoAngle = parseFloat(helixIsoAngle) || 0;
  const pHelixHWRatio = parseFloat(helixHWRatio) || 0;


  const minLogRadiusWarn = currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC && (Math.round(pInnerRadius) < 1.0 || Math.round(pOuterRadius) < 1.0);
  const minArchRadiusWarn = currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN && (pInnerRadius === 0 && pOuterRadius === 0);

  const spiralGap = currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN
    ? Math.abs(pOuterRadius - pInnerRadius) / (pRotations || 1)
    : 0;

  const logParamB = currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC && pRotations > 0
    ? (Math.log(Math.max(pOuterRadius, 1) / Math.max(pInnerRadius, 1))) / (2 * Math.PI * pRotations)
    : 0;

  const degreeIncrement = pDegrees / Math.floor(pPoints);

  const sendSpiralData = () => {
    emit('create-spiral', {
      currentSpiralType: currentSpiralType,
      innerRadius: Math.round(pInnerRadius),
      outerRadius: Math.round(pOuterRadius),
      degrees: Math.round(pDegrees),
      points: Math.round(pPoints),
      lineWidth: pLineWidth,
      shouldMakeHelix,
      shouldAdjustHelixHeight,
      helixOffsetX: pHelixOffsetX,
      helixOffsetY: pHelixOffsetY,
      helixHWRatio: pHelixHWRatio,
      helixIsoAngle: pHelixIsoAngle
    });
  };

  useEffect(() => {
    if (continuouslyUpdate) {
      sendSpiralData();
    }
  }, [
    spiralType, innerRadius, outerRadius, degrees, rotations, points, lineWidth,
    shouldMakeHelix, shouldAdjustHelixHeight, helixOffsetX, helixOffsetY, helixIsoAngle, helixHWRatio,
    continuouslyUpdate
  ]);

  const handleRotationsChange = (val: string) => {
    setRotations(val);
    const v = parseFloat(val);
    if (!isNaN(v)) setDegrees((v * 360).toString());
  };

  const handleDegreesChange = (val: string) => {
    setDegrees(val);
    const v = parseFloat(val);
    if (!isNaN(v)) setRotations((v / 360).toString());
  };

  const handleIsoAngleChange = (val: string) => {
    setHelixIsoAngle(val);
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setHelixHWRatio(Math.cos(v * (Math.PI / 180)).toFixed(3));
    }
  };

  const handleHWRatioChange = (val: string) => {
    setHelixHWRatio(val);
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setHelixIsoAngle(((Math.acos(v)) * (180 / Math.PI)).toFixed(1));
    }
  };


  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text style={{ color: '#777' }}>Spiral Type:</Text>
      <VerticalSpace space="small" />
      <Dropdown
        onChange={(event) => setSpiralType(event.currentTarget.value)}
        options={[
          { value: 'Archimedean Spiral' },
          { value: 'Logarithmic Spiral' }
        ]}
        value={spiralType}
      />

      <VerticalSpace space="large" />

      <div class="flex gap-2">
        <div class="flex-1">
          <Text style={{ color: '#777' }}>Inner Radius:</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric value={innerRadius} onNumericValueInput={(v) => setInnerRadius(v !== null ? v.toString() : '0')} />
        </div>
        <div class="flex-1">
          <Text style={{ color: '#777' }}>Outer Radius:</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric value={outerRadius} onNumericValueInput={(v) => setOuterRadius(v !== null ? v.toString() : '0')} />
        </div>
      </div>

      {minLogRadiusWarn && (
        <div class="mt-2 text-xs text-orange-600 flex items-center gap-1 bg-orange-100 p-1 rounded">
          Minimum radius applied to logarithmic spiral can't be less than 1.0.
        </div>
      )}
      {minArchRadiusWarn && (
        <div class="mt-2 text-xs text-orange-600 flex items-center gap-1 bg-orange-100 p-1 rounded">
          Both Inner and Outer radius can't be 0. Forcing outer radius to 1.0.
        </div>
      )}

      <VerticalSpace space="large" />

      <Text style={{ color: '#777' }}>Rotation in degrees and full rotations:</Text>
      <VerticalSpace space="small" />
      <div class="flex gap-2">
        <div class="flex-1 flex items-center gap-2">
          <Text style={{ color: '#777' }} class="w-12">Deg</Text>
          <TextboxNumeric value={degrees} onNumericValueInput={(v) => handleDegreesChange(v !== null ? v.toString() : '0')} />
        </div>
        <div class="flex-1 flex items-center gap-2">
          <Text style={{ color: '#777' }} class="w-12">Rot</Text>
          <TextboxNumeric value={rotations} onNumericValueInput={(v) => handleRotationsChange(v !== null ? v.toString() : '0')} incrementBig={1} incrementSmall={0.125} />
        </div>
      </div>

      <div class="mt-2 text-xs text-gray-500 bg-gray-100 p-1 rounded">
        {currentSpiralType === SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN ? (
          `Gap of ${spiralGap.toFixed(2)} after each rotation of the spiral`
        ) : (
          `Log spiral equation: a*e^(b*theta) -> a=${innerRadius} theta=${logParamB.toFixed(4)}`
        )}
      </div>

      <VerticalSpace space="large" />

      <div class="flex gap-2">
        <div class="flex-1">
          <Text style={{ color: '#777' }}># of points:</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric value={points} onNumericValueInput={(v) => setPoints(v !== null ? v.toString() : '0')} />
          <div class="mt-2 text-xs text-gray-500 bg-gray-100 p-1 rounded">
            Point every {degreeIncrement.toFixed(2)} degrees
            {pPoints < 2 ? ' - USING 2 POINTS' : ''}
            {pDegrees < 1 ? ' - USING ROTATION of 1°' : ''}
          </div>
        </div>
        <div class="flex-1">
          <Text style={{ color: '#777' }}>Line width:</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric value={lineWidth} onNumericValueInput={(v) => setLineWidth(v !== null ? v.toString() : '0')} />
        </div>
      </div>

      <VerticalSpace space="large" />

      <div class="border border-gray-300 rounded p-3 bg-gray-50">
        <div class="flex gap-4 mb-4">
          <Checkbox value={shouldMakeHelix} onChange={(e) => setShouldMakeHelix(e.currentTarget.checked)}>
            <Text>Make helix from spiral</Text>
          </Checkbox>
          <Checkbox value={shouldAdjustHelixHeight} onChange={(e) => setShouldAdjustHelixHeight(e.currentTarget.checked)}>
            <Text>Adjust height by angle</Text>
          </Checkbox>
        </div>

        <div class="flex gap-2 mb-4">
          <div class="flex-1 flex items-center gap-2">
            <Text style={{ color: '#777' }} class="w-16">Total Δx</Text>
            <TextboxNumeric value={helixOffsetX} onNumericValueInput={(v) => setHelixOffsetX(v !== null ? v.toString() : '0')} />
          </div>
          <div class="flex-1 flex items-center gap-2">
            <Text style={{ color: '#777' }} class="w-16">Total Δy</Text>
            <TextboxNumeric value={helixOffsetY} onNumericValueInput={(v) => setHelixOffsetY(v !== null ? v.toString() : '0')} />
          </div>
        </div>

        <Text style={{ color: '#777' }}>Set parallel projection angle (width/height ratio):</Text>
        <VerticalSpace space="small" />
        <div class="flex gap-2">
          <div class="flex-1 flex items-center gap-2">
            <Text style={{ color: '#777' }} class="w-16">Angle</Text>
            <TextboxNumeric value={helixIsoAngle} onNumericValueInput={(v) => handleIsoAngleChange(v !== null ? v.toString() : '0')} />
          </div>
          <div class="flex-1 flex items-center gap-2">
            <Text style={{ color: '#777' }} class="w-16">H/W ratio</Text>
            <TextboxNumeric value={helixHWRatio} onNumericValueInput={(v) => handleHWRatioChange(v !== null ? v.toString() : '0')} incrementSmall={0.001} incrementBig={0.1} />
          </div>
        </div>
      </div>

      <VerticalSpace space="large" />

      <Toggle value={continuouslyUpdate} onChange={(e) => setContinuouslyUpdate(e.currentTarget.checked)}>
        <Text>Continuously Update</Text>
      </Toggle>

      <VerticalSpace space="large" />

      <div class="flex gap-2 mb-4">
        <div class="flex-1">
          <Button disabled={continuouslyUpdate} fullWidth onClick={sendSpiralData}>
            Update Spiral
          </Button>
        </div>
        <div class="flex-1">
          <Button fullWidth secondary onClick={() => emit('done')}>
            Done
          </Button>
        </div>
      </div>

    </Container>
  );
}

export default render(Plugin);
