import React, {useMemo, useState} from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./HostApplication";
import {createStyles, makeStyles} from "@material-ui/styles";
import {Autocomplete, TextField, Theme} from "@material-ui/core";
import {CONTINENT_NAMES, handleContinents} from "./SalesDashboard";

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

export const DASHBOARD_FILTER: IDashboardInfo = {

    name: "Filter",
    path: "shared:/Embedded/Filter",

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

    openCaption: "Filter (Asia,Europe)",
    openTooltip: "click to open the report with parameters: (Asia,Europe)",

    interactions: Interactions,

}

