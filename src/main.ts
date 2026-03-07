import { on, showUI } from '@create-figma-plugin/utilities';
import { makeSpiralPoints } from './spiral';

export default function () {
  showUI({ width: 400, height: 620, themeColors: true });

  let svgPath: SceneNode | false = false;

  on('create-spiral', (data: any) => {
    const { path: pathDAttribute } = makeSpiralPoints(data);

    if (svgPath) {
      svgPath.remove();
    }

    svgPath = figma.createNodeFromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathDAttribute}" fill="none" stroke="black" stroke-width="${data.lineWidth}px"/> </svg>`
    );

    if (figma.currentPage.selection.length > 0) {
      const n0 = figma.currentPage.selection[0];
      const spiralXOffset = svgPath.x;
      const spiralYOffset = svgPath.y;
      const centerX = n0.x + n0.width / 2 + spiralXOffset;
      const centerY = n0.y + n0.height / 2 + spiralYOffset;
      svgPath.x = centerX;
      svgPath.y = centerY;
    }
  });

  on('done', () => {
    figma.closePlugin();
  });
}
