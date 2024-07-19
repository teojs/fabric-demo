import * as fabric from 'fabric'

/**
 * 自定义控制器的样式
 */
export default function useControls() {
  // fabric.FabricObject.prototype.controls = {
  //   ml: new fabric.Control({
  //     x: -0.5,
  //     y: 1,
  //     offsetX: -1,
  //     cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
  //     actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
  //     getActionName: fabric.controlsUtils.scaleOrSkewActionName,
  //     cursorStyle: 'circle',
  //     render: () => '',
  //   }),
  // }
  fabric.FabricObject.prototype.cornerStyle = 'circle'
}
