import React from "react";
import {
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
        <Separator turns={index * turns} key={index} style={props.style} />
    ));
}

export default function ProgressBar({stamina}) {
    return <>
        <ExternalDiv>
            <CircularProgressbarWithChildren
                value={stamina.currentStaminaPercentage}
                text={`${stamina.currentStaminaPercentage}%`}
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
        </ExternalDiv>
    </>
}

function ExternalDiv(props) {
    return (
        <div style={{ marginBottom: 10 }}>
            <hr style={{ border: "2px solid #ddd" }} />
            <div style={{ marginTop: 30, display: "flex" }}>
                <div style={{width: "50%", margin: '0 auto' }}>{props.children}</div>
            </div>
        </div>
    );
}
