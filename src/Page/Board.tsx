import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StyleColor from "../components/StyleColor";
import ToolBoard from "../components/ToolBoard";
import { ReactComponent as Delete } from "../icon/delete.svg";
declare var window: any;

function Board() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [option, setOption] = useState({
    pen: "mouse",
    isDrawing: false,
    color: "black",
    strokeWidth: 4,
  });
  const [displayColorTabel, setDisplayColorTable] = useState(false);

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
  const handleChangeAttribute = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleClear = () => {
    console.log("aa");
  };
  const handleDisplayColorTable = () => {
    setDisplayColorTable(true);
  };
  return (
    <>
      <canvas id="board" width={size.width} height={size.height}></canvas>
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
        <button onClick={handleClear}>
          <Delete />
        </button>
      </div>
    </>
  );
}

export default Board;
