type canvas = any;
type message = any;
type objectDrawing = any;
type coordinateOrigin = {
  x: number;
  y: number;
};
const handleDraw = (
  canvas: canvas,
  message: message,
  objectDraw: objectDrawing,
  coordinateOrigin: coordinateOrigin
) => {
  const objectInCanvas = canvas.getObjects();
  switch (message.event) {
    case "createObject":
      let objectDrawing
                         
      break;
    default:
      break;
  }
};
export {};
