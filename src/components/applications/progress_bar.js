import React from "react";
import { render } from "react-dom";
// Import react-circular-progressbar module and styles
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import _ from "lodash";

function Separator(props) {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${props.turns}turn)`
      }}
    >
      <div style={props.style} />
    </div>
  );
}

function RadialSeparators(props) {
  const turns = 1 / props.count;
  return _.range(props.count).map(index => (
    <Separator turns={index * turns} style={props.style} />
  ));
}


const percentage = 66;

export default function ProgressBar({stamina}) {
    return <>
    <Example>
        <CircularProgressbarWithChildren
            value={stamina.currentStaminapercentage}
            text={`${stamina.currentStaminapercentage}%`}
            strokeWidth={10}
            styles={buildStyles({
                strokeLinecap: "butt"
            })}
            >
            <RadialSeparators
                count={12}
                style={{
                background: "#fff",
                width: "2px",
                // This needs to be equal to props.strokeWidth
                height: `${10}%`
                }}
            />
        </CircularProgressbarWithChildren>
    </Example>
    </>
}

function Example(props) {
    return (
      <div style={{ marginBottom: 10 }}>
        <hr style={{ border: "2px solid #ddd" }} />
        <div style={{ marginTop: 30, display: "flex" }}>
            <div style={{width: "50%", margin: '0 auto' }}>{props.children}</div>
        </div>
      </div>
    );
}
