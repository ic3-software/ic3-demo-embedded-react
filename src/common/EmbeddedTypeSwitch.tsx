import React from 'react';
import {FormControl, MenuItem, Select, Typography} from "@mui/material";

export type EmbeddedType = "div" | "iframe";

export interface EmbeddedTypeSwitchProps {

    className: string;

    type: EmbeddedType;

    onTypeChange: (type: EmbeddedType) => void;

    version: string;

}

export default function EmbeddedTypeSwitch(props: EmbeddedTypeSwitchProps) {

    const {className, type, onTypeChange, version} = props;

    return (

        <div className={className}>

            <Typography variant={"body2"}>
                {"This application is demonstrating how to embed (and drive) icCube dashboards via a "}
            </Typography>
            <FormControl sx={{m: 1, minWidth: 120}} size="small">
                <Select value={type} onChange={event => onTypeChange(event.target.value as any)}>
                    <MenuItem value={'div'}>DIV</MenuItem>
                    <MenuItem value={'iframe'}>iFrame</MenuItem>
                </Select>
            </FormControl>
            <Typography variant={"body2"} color={"primary"} style={{paddingLeft: "10px"}}>
                {version}
            </Typography>

        </div>

    );

}
