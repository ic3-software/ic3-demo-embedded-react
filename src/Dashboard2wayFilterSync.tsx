import React, {useMemo, useState} from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./HostApplication";
import {createStyles, makeStyles} from "@mui/styles";
import {Autocomplete, TextField, Theme} from "@mui/material";
import {CONTINENT_NAMES, handleContinents} from "./Dashboard2way";

const styles = (theme: Theme) => createStyles({

    root: {

        paddingTop: theme.spacing(4),

    },


});

const useStyles = makeStyles(styles);

function Interactions(props: IDashboardInteractionProps) {

    const classes = useStyles();

    const {reporting} = props;

    const [continents, setContinents] = useState<string[] | null>(["Asia", "Europe"]);

    useMemo(() => {

        reporting.onEvent("continent", (value) => {

            console.log("[iFrame] onEvent(continent)", value);

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
        <div className={classes.root}>

            <Autocomplete

                multiple fullWidth size={"small"} options={CONTINENT_NAMES} value={continents ?? undefined}

                renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="continents"/>
                )}

                onChange={(event, value) => {
                    handleContinents(setContinents, reporting, value);
                }}

            />

        </div>
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
                {caption: "Asia", name: "Asia", uniqueName: "[Asia]"},
                {caption: "Europe", name: "Europe", uniqueName: "[Europe]"},
            ]
        }
    ],

    openCaption: "2-way Filter Sync.",
    openTooltip: "click to open the report with parameters: (Asia,Europe)",

    interactions: Interactions,

}

