import React, {useMemo, useState} from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./DemoDashboards";
import {styled} from "@mui/material/styles";
import {Autocomplete, TextField, Typography} from "@mui/material";
import {IEventContent, IEventContentItem, IReporting} from '@ic3/reporting-api-embedded';
import {HostLogger} from '../HostLogger';

const StyledDiv = styled("div")(({theme}) => ({

    flex: 1,

    display: "flex",
    flexDirection: "column",

    paddingTop: theme.spacing(4),
    color: theme.palette.text.primary,

    "& .ic3-two-way-year": {

        paddingTop: theme.spacing(4),

    },

    "& .ic3-two-way-year-content": {

        flex: 1,

        paddingTop: theme.spacing(2),

    },

}));

export const CONTINENT_NAMES = ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"];

export const CONTINENT_UNIQUE_NAMES = [
    "[Geography].[Geography].[Continent].&[AF]"
    , "[Geography].[Geography].[Continent].&[AS]"
    , "[Geography].[Geography].[Continent].&[EU]"
    , "[Geography].[Geography].[Continent].&[NA]"
    , "[Geography].[Geography].[Continent].&[OC]"
    , "[Geography].[Geography].[Continent].&[SA]"
];

function continentUniqueName(continent: string) {
    return CONTINENT_UNIQUE_NAMES[CONTINENT_NAMES.indexOf(continent)];
}

export function handleContinents(setContinents: any, reporting: IReporting, continents: readonly string[]) {

    let value: IEventContent | null = null;

    if (Array.isArray(continents)) {

        value = continents.map(c => ({
            caption: c, name: c, uniqueName: continentUniqueName(c)
        }));

    } else if (continents) {

        value = {
            caption: continents[0], name: continents[0], uniqueName: continentUniqueName(continents[0])
        }

    }

    HostLogger.info("Host", "fireEvent(continent)", value);

    reporting.fireEvent("continent", value);
    setContinents(continents);

}

function Interactions(props: IDashboardInteractionProps) {

    const {reporting} = props;

    const [continents, setContinents] = useState<string[]>(["Asia", "Europe", "North America"]);
    const [years, setYears] = useState<IEventContentItem[] | null>();

    useMemo(() => {

        reporting.onEvent("year", (value) => {

            if(Array.isArray(value)) {
                setYears(value);
            } else if(value) {
                setYears([value]);
            } else {
                setYears(null);
            }

        });

    }, [reporting]);

    return (
        <StyledDiv>
            <Autocomplete

                multiple fullWidth size={"small"} options={CONTINENT_NAMES} value={continents}

                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="continents"/>
                )}

                onChange={(event, value) => {
                    handleContinents(setContinents, reporting, value);
                }}

            />

            <div className={"ic3-two-way-year"}>
                <Typography variant={"body2"}>{"Selected Year(s) from the Dashboard:"}</Typography>
            </div>

            <div className={"ic3-two-way-year-content"}>
                {years && <iframe
                    style={{border: "0px none", width: "100%", height: "100%"}}
                    src={"https://en.m.wikipedia.org/wiki/" + years[0].name}
                />}
            </div>
        </StyledDiv>
    )
}

/**
 * Two way communication: Host <=> icCube
 *
 * The host is sending events to icCube and react from icCube events (opening a Wikipedia page).
 */
export const DASHBOARD_2_WAY: IDashboardInfo = {

    name: "2way",
    path: "shared:/Embedded/2way",

    /**
     * The report is listening on the event "continent"
     */
    params: [
        {
            channelName: "continent",
            value: [
                {caption: "Asia", name: "Asia", uniqueName: "[Asia]"},
                {caption: "Europe", name: "Europe", uniqueName: "[Europe]"},
                {caption: "North America", name: "North America", uniqueName: "[North America]"},
            ]
        }
    ],

    openCaption: "2-way",
    openTooltip: "click to open the report with parameters: (Asia, Europe, North America)",

    interactions: Interactions,

}
