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

export default function ProgressBar({percentage}) {
    return <>
    <Example>
        <CircularProgressbarWithChildren
            value={percentage}
            text={`${percentage}%`}
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
      <div style={{ marginBottom: 80 }}>
        <hr style={{ border: "2px solid #ddd" }} />
        <div style={{ marginTop: 30, display: "flex" }}>
          <div style={{ width: "50%", paddingRight: 30 }}>{props.children}</div>
          <div style={{ width: "50%" }}>
            {/* <h3 className="h5">{props.label}</h3>
            <p>{props.description}</p> */}
          </div>
        </div>
      </div>
    );
}
