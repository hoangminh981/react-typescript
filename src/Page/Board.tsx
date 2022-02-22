import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StyleColor from "../components/StyleColor";

declare var window: any;

function Board() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [option, setOtion ] = useState({
    pen: "mouse",
    isDrawing: false,
    color: "black",
    strokeWidth: 4
  })
  const [displayColorTabel, setDisplayColorTable] = useState(false)

  const [canvas, setCanvas] = useState(null);
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
        // handleDraw(dataFromServer)
      };
    }
  }, [socket]);
  const handleChangeAttribute = (e : any) => {}

  const handleDisplayColorTable = () => {
    setDisplayColorTable(true)
}
  return (
    <>
      <canvas
        id="board"
        width={size.width}
        height={size.height}
        className=" border-2 border-black"
      ></canvas>
      <div className="fixed right-0 top-0">
        <StyleColor
          setAttribute={handleChangeAttribute}
          color={option.color}
          strokeWidth={option.strokeWidth}
          displayColorTabel={displayColorTabel}
          handleDisplayColorTable={handleDisplayColorTable}
        />
      </div>
    </>
  );
}

export default Board;
