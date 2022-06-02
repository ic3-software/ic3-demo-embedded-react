import React, {useMemo, useState} from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./DemoDashboards";
import {Autocomplete, TextField} from "@mui/material";
import {CONTINENT_NAMES, handleContinents} from "./Dashboard2way";
import {styled} from "@mui/material/styles";

const StyledDiv = styled("div")(({theme}) => ({

    paddingTop: theme.spacing(4),

}));


function Interactions(props: IDashboardInteractionProps) {


    const {reporting} = props;

    const [continents, setContinents] = useState<string[] | null>(["Asia", "Europe"]);

    useMemo(() => {

        reporting.onEvent("continent", (value) => {

            console.log("[ic3-demo] onEvent(continent)", value);

            let continentNames: string[] = [] /* multi does not like null value */;

            if (Array.isArray(value)) {
                continentNames = value.map(v => v.name);
            } else if (value) {
                continentNames = [value.name];
            }

            setContinents(continentNames)

        });

    }, [reporting]);


    return (
        <StyledDiv>

            <Autocomplete

                multiple fullWidth size={"small"} options={CONTINENT_NAMES} value={continents ?? undefined}

                renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="continents"/>
                )}

                onChange={(event, value) => {
                    handleContinents(setContinents, reporting, value);
                }}

            />

        </StyledDiv>
    );
}

/**
 * Two way communication: Host <=> icCube
 *
 * The host application is keeping a filter content synchronized with the content of a filter in iCube.
 */
export const DASHBOARD_2_WAY_FILTER_SYNC: IDashboardInfo = {

    name: "2wayFilterSync",
    path: "shared:/Embedded/2wayFilterSync",

    /**
     * The report is listening on the event "continent"
     */
    params: [
        {
            channelName: "continent",
            value: [
                {caption: "Asia", name: "Asia", uniqueName: "[Geography].[Geography].[Continent].&[AS]"},
                {caption: "Europe", name: "Europe", uniqueName: "[Geography].[Geography].[Continent].&[EU]"},
            ]
        }
    ],

    openCaption: "2-way Filter Sync.",
    openTooltip: "click to open the report with parameters: (Asia,Europe)",

    interactions: Interactions,

}

