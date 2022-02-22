import React, { useState, useEffect } from 'react';
import { ReactComponent as Mouse } from "../icon/mouse.svg";
import { ReactComponent as Pencil } from "../icon/pencil.svg";
import { ReactComponent as Eraser } from "../icon/eraser.svg";
import { ReactComponent as Rectangle } from "../icon/rectangle.svg";
import { ReactComponent as Cycle } from "../icon/cycle.svg";
import { ReactComponent as Line } from "../icon/line.svg";
import ToolBoardCheckBox from './ToolBoardCheckBox';


interface ParamTypeToolBoard {
    type : string;
    setPen : any;

  }
type listObject = Array<{ type : string; icon : JSX.Element }>

export default function ToolBoard(props : ParamTypeToolBoard ) {
    
    const [displaySubObjects, setDisplaySubObjects] = useState(false)
    const [listOptions, setListOptions] = useState([
        {
            type: "mouse",
            icon: <Mouse />
        },
        {
            type: "pencil",
            icon: <Pencil />
        },
        {
            type: "rectag",
            icon: <Rectangle />
        },
        {
            type: "eraser",
            icon: <Eraser />
        },
    ])

    const subOption = [
        {
            type: "rectag",
            icon: <Rectangle />
        },
        {
            type: "cycle",
            icon: <Cycle />
        },
        {
            type: "line",
            icon: <Line />
        },
    ]
    let tempListOption = [...listOptions]

    const updateListOption = (templist : listObject, subOption : listObject) => {
        const indexTempListOption = templist.findIndex(x => x.type === 'rectag' || x.type === 'cycle' || x.type === 'line')
        const indexSubListOption = subOption.findIndex(x => x.type === props.type)
        if (indexSubListOption !== -1) {
            templist[indexTempListOption].icon = subOption[indexSubListOption].icon
            templist[indexTempListOption].type = subOption[indexSubListOption].type
        }
        return templist
    }
    useEffect(() => {
        const newList = updateListOption(tempListOption, subOption)
        setListOptions(newList)
    }, [displaySubObjects])

    const displayOption = listOptions.map(e => {
        return <ToolBoardCheckBox
            selected={" bg-blue-400 text-white"}
            hover={"hover:text-blue-200"}
            key={e.type}
            styles="w-9 h-9 mr-1 ml-1 mt-0.125"
            value={e.type}
            checked={props.type === e.type}
            icon={e.icon}
        />
    })

    const displaySubObject = subOption.map(e => {
        return <ToolBoardCheckBox
            selected={" bg-blue-400 text-white"}
            hover={"hover:text-blue-200"}
            key={e.type}
            styles="w-9 h-9 mr-1 ml-1 mt-0.125"
            value={e.type}
            checked={props.type === e.type}
            icon={e.icon}
        />
    })

    const handleChangePen = (e : any) => {
        if (e.target.value === 'rectag' || e.target.value === 'line' || e.target.value === 'cycle') {
            setDisplaySubObjects(true)
        }
        props.setPen(e.target.value)
    }

    return (
        <>
            <div className='absolute bottom-14 left-47/100'>
                {displaySubObjects && (props.type === "rectag" || props.type === "cycle" || props.type === "line") ?
                    <div className='flex border-2 border-black h-11 w-46 rounded-lg' onChange={(e) => {
                        handleChangePen(e)
                        setDisplaySubObjects(false)
                    }}>
                        {displaySubObject}
                    </div>
                    : null
                }
            </div>
            <div className="flex border-2 border-black h-11 w-46 rounded-lg" onChange={handleChangePen}>
                {displayOption}
            </div >
        </>
    )
}
