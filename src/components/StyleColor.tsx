import React from "react";
import ToolBoardCheckBox from "../components/ToolBoardCheckBox";
import IconColor from "../svg/coloricon.svg";
import SizeL from "../svg/sizeL.svg";
import SizeM from "../svg/sizeM.svg";
import SizeS from "../svg/sizeS.svg";

interface ParamType {
  strokeWidth: number;
  color: string;
  handleDisplayColorTable: any;
  displayColorTabel: boolean;
  setAttribute: any;
}
function StyleColor(props: ParamType) {
  const handleChangeAttribute = (e: any) => {
    props.setAttribute(e.target);
  };

  const listColor = ["black", "red", "blue", "green", "brown", "#7746f1"];

  const listSize = [
    {
      icon: SizeS,
      size: 4,
    },
    {
      icon: SizeM,
      size: 6,
    },
    {
      icon: SizeL,
      size: 10,
    },
  ];

  const listSizeMap = listSize.map((e) => {
    return (
      <ToolBoardCheckBox
        icon={e.icon}
        key={e.size}
        value={e.size}
        name={"strokeWidth"}
        selected={" bg-blue-400"}
        hover={"hover:bg-blue-200"}
        checked={props.strokeWidth === e.size}
      />
    );
  });
  const listColorMap = listColor.map((e) => {
    return (
      <ToolBoardCheckBox
        icon={e}
        key={e}
        value={e}
        name={"stroke"}
        selected={" bg-blue-400"}
        hover={"hover:bg-blue-200"}
        checked={props.color === e}
      />
    );
  });

  return (
    <div
      className="w-24 h-11 m-2 border-2 rounded-lg"
      onClick={props.handleDisplayColorTable}
    >
      <div className=" flex m-2 justify-around">
        <p>Styles</p>
        <div>
          <img src={IconColor}/>
        </div>
      </div>
      {props.displayColorTabel ? (
        <div>
          <div className="flex relative top-3 right-9 w-32 border-2 rounded-lg p-1">
            <span>Color</span>
            <div
              className="flex flex-wrap h-16 justify-around"
              onChange={handleChangeAttribute}
            >
              {listColorMap}
            </div>
          </div>
          <div className="flex relative top-3 right-9 w-32 border-2 rounded-lg p-1">
            <span>Size</span>
            <div
              className="flex flex-wrap h-6 justify-around"
              onChange={handleChangeAttribute}
            >
              {listSizeMap}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default StyleColor;
