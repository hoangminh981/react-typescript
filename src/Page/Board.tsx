import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StyleColor from "../components/Tool/StyleColor";
import ToolBoard from "../components/Tool/ToolBoard";

import { ReactComponent as Delete } from "../icon/delete.svg";

import { v4 as uuidv4 } from "uuid";

import {
  getAbsLeft,
  getAbsTop,
  getAbsScaleX,
  getAbsScaleY,
} from "../components/HandleDraw/GetAbsCordinate";

declare var window: any;

type event = React.ChangeEvent<HTMLInputElement>;

function Board() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [option, setOption] = useState({
    pen: "mouse",
    isDrawing: false,
    color: "black",
    strokeWidth: 4,
  });
  const [displayColorTabel, setDisplayColorTable] = useState(false);
  const [canvas, setCanvas] = useState<any>(null);
  const [size, setSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const { id } = useParams();
  useEffect(() => {
    const canvasElement = new window.fabric.Canvas("board");
    setCanvas(canvasElement);
    const onSocket = new WebSocket(
      `wss://draw-realtime-socket.herokuapp.com/${id}`
    );
    setSocket(onSocket);
  }, []);

  useEffect(() => {
    if (socket !== null) {
      setSize({
        ...size,
        height: window.innerHeight,
        width: window.innerWidth,
      });
      socket.onopen = () => {
        console.log("WebSocket open");
      };
      socket.onmessage = (e) => {
        let dataFromServer = JSON.parse(e.data);
        console.log(dataFromServer);
      };
    }
  }, [canvas]);
  const handleDisplayColorTable = () => {
    setDisplayColorTable(true);
  };
  const createObject = (event: event) => {
    let pointer = canvas.getPointer(event);
    switch (option.pen) {
      case "line":
        return {
          coordinate: [pointer.x, pointer.y, pointer.x, pointer.y],
          option: {
            id: uuidv4(),
            type: "line",
            stroke: option.color,
            strokeWidth: option.strokeWidth,
            perPixelTargetFind: true,
          },
        };
      case "rectag":
        return {
          pointer: pointer,
          option: {
            id: uuidv4(),
            left: pointer.x,
            top: pointer.y,
            width: pointer.x - pointer.x,
            height: pointer.y - pointer.y,
            stroke: option.color,
            strokeWidth: option.strokeWidth,
            fill: "",
            type: "rectag",
            perPixelTargetFind: true,
          },
        };
      case "cycle":
        return {
          pointer: pointer,
          option: {
            id: uuidv4(),
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            originX: "center",
            originY: "center",
            stroke: option.color,
            strokeWidth: option.strokeWidth,
            fill: "",
            type: "cycle",
            perPixelTargetFind: true,
          },
        };
      case "pencil":
        return {
          pointer: pointer,
          option: {
            id: uuidv4(),
            stroke: option.color,
            strokeWidth: option.strokeWidth,
            type: "pencil",
            perPixelTargetFind: true,
          },
        };
      default:
        break;
    }
  };
  const handleMouseDown = (e: event) => {
    const object = createObject(e);
    switch (option.pen) {
      case "mouse":
        setDisplayColorTable(false);
        // setObjectDraw(null)
        break;
      default:
        let message = {
          event: "createObject",
          object: object,
        };
        if (socket) {
          socket.send(JSON.stringify(message));
          setOption({ ...option, isDrawing: true });
          canvas.set({
            selection: false,
          });
        }
        break;
    }
  };
  const handleMouseMove = (e: event) => {
    const objectActives = canvas.getActiveObjects();
    if (objectActives.length > 0) {
      return;
    }
    const pointer = canvas.getPointer(e);
    let message = {
      event: "setCoordinateObject",
      message: {
        pointer: pointer,
        type: option.pen,
      },
    };
    if (socket && option.isDrawing) {
      socket.send(JSON.stringify(message));
    }
  };
  const handleMouseUp = (e: event) => {
    canvas.isDrawingMode = false;
    setOption({ ...option, isDrawing: false });
    canvas.set({
      selection: true,
    });
  };
  const handleScalling = (e: event) => {
    const objectSelected = canvas.getActiveObjects();
    objectSelected.forEach((object: any) => {
      object.set({
        perPixelTargetFind: true,
      });
      let message = {
        event: "objectScalling",
        message: {
          id: object.id,
          top: getAbsTop(object),
          left: getAbsLeft(object),
          height: object.height,
          width: object.width,
          scaleX: getAbsScaleX(object),
          scaleY: getAbsScaleY(object),
          angle: object.angle,
        },
      };
      if (socket) {
        socket.send(JSON.stringify(message));
      }
    });
  };
  const handleChangeAttribute = (e: any) => {
    const objectChanged = canvas.getActiveObjects();
    let strokeWidth: string;
    let stroke: string;
    switch (e.name) {
      case "strokeWidth":
        setOption({ ...option, strokeWidth: parseInt(e.value) });
        strokeWidth = e.value;
        break;
      case "stroke":
        setOption({ ...option, color: e.value });
        stroke = e.value;
    }
    objectChanged.forEach((object: any) => {
      let message = {
        event: "changeAttribute",
        message: {
          id: object.id,
          strokeWidth: !parseInt(strokeWidth)
            ? option.strokeWidth
            : parseInt(strokeWidth),
          stroke: !stroke ? option.color : stroke,
        },
      };
      if (socket) {
        socket.send(JSON.stringify(message));
      }
    });
  };
  const handleClear = () => {
    let message = { event: "clearCanvas" };
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };
  const hanleCoppyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    let message: {
      event: string;
      message: {
        id: [string];
      };
    };
    let eventType: any;
    const objectsSelected = canvas.getActiveObjects();
    const id = !objectsSelected
      ? null
      : objectsSelected.map((object: any) => {
          return object.id;
        });
    switch (e.keyCode) {
      case 8: // Backspace
        eventType = "deleteObjects";
        break;
    }
    message = {
      event: eventType,
      message: {
        id: id,
      },
    };
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };
  const handleSelected = () => {
    const objectsSelecteds = canvas.getActiveObjects();
    objectsSelecteds.forEach((object: any) => {
      object.set({
        perPixelTargetFind: false,
      });
    });
  };
  const handleZoom = (event: any) => {
    let delta = event.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    event.e.preventDefault();
    event.e.stopPropagation();
  };
  useEffect(() => {
    if (canvas !== null) {
      document.addEventListener("keydown", handleKeyDown);
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("object:scaling", handleScalling);
      canvas.on("object:rotating", handleScalling);
      canvas.on("object:moving", handleScalling);
      canvas.on("selection:created", handleSelected);
      canvas.on("mouse:wheel", handleZoom);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("object:scaling", handleScalling);
        canvas.off("object:rotating", handleScalling);
        canvas.off("object:moving", handleScalling);
        canvas.off("selection:created", handleSelected);
        canvas.off("mouse:wheel", handleZoom);
      };
    }
  }, [canvas, handleMouseDown]);
  return (
    <>
      <canvas id="board" width={size.width} height={size.height}></canvas>
      <div
        onClick={hanleCoppyLink}
        className="hover:bg-blue-300 absolute h-24 w-36 border-2 rounded-tr-full rounded-bl-full top-12"
      >
        <div className="text-ellipsis overflow-hidden w-16 relative top-8 left-10 whitespace-nowrap">
          Room {id}
        </div>
      </div>
      <div className="fixed right-0 top-0">
        <StyleColor
          setAttribute={handleChangeAttribute}
          color={option.color}
          strokeWidth={option.strokeWidth}
          displayColorTabel={displayColorTabel}
          handleDisplayColorTable={handleDisplayColorTable}
        />
      </div>
      <div className="fixed flex justify-center bottom-3 w-full">
        <ToolBoard
          setPen={(valueOption: string) => {
            setOption({ ...option, pen: valueOption });
          }}
          type={option.pen}
        />
        <button
          className="transform hover:bg-#e5e7eb rounded-xl  relative m-0 p-3 flex align-middle justify-center border-2 border-white transition duration-300 hover:scale-125"
          onClick={handleClear}
        >
          <Delete />
        </button>
      </div>
    </>
  );
}

export default Board;
