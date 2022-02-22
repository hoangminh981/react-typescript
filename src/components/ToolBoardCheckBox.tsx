import React from 'react';

interface ParamTypeCheckBox {
    checked : boolean;
    name : string;
    selected : string;
    hover : string;
    icon :  any;
    value : number | string
}

function ToolBoardCheckBox(props : ParamTypeCheckBox) {
    const checked = props.checked
    return (
        <>
            <label>
                <input
                    value = {props.value}
                    style={{ display: 'none' }}
                    type="checkbox"
                    name= {props.name}
                />
                <div className={checked === true ?  `${props.selected}` : `${props.hover}`}><img src = {props.icon}/></div>
            </label>
        </>
    )
}

export default ToolBoardCheckBox;