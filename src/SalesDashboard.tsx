import React, {useMemo, useState} from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./HostApplication";
import {createStyles, makeStyles} from "@material-ui/styles";
import {Autocomplete, TextField, Theme, Typography} from "@material-ui/core";
import {IEventContent, IReporting} from '@ic3/reporting-api';

const styles = (theme: Theme) => createStyles({

    root: {

        flex: 1,

        display: "flex",
        flexDirection: "column",

        paddingTop: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    years: {

        paddingTop: theme.spacing(4),

    },

    yearsContent: {

        flex: 1,

        paddingTop: theme.spacing(2),

    },

});

const useStyles = makeStyles(styles);

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

export function handleContinents(setContinents: any, reporting: IReporting, continents: string[]) {

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

    console.log("[iFrame] fireEvent(continent)", value);

    reporting.fireEvent("continent", value);
    setContinents(continents);

}

function Interactions(props: IDashboardInteractionProps) {

    const classes = useStyles();

    const {reporting} = props;

    const [continents, setContinents] = useState<string[]>(["Asia", "Europe", "North America"]);
    const [years, setYears] = useState<IEventContent | null>();

    useMemo(() => {

        reporting.onEvent("year", (value) => setYears(value));

    }, [reporting]);

    return (
        <div className={classes.root}>

            <Autocomplete

                multiple fullWidth size={"small"} options={CONTINENT_NAMES} value={continents}

                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="continents"/>
                )}

                onChange={(event, value) => {
                    handleContinents(setContinents, reporting, value);
                }}

            />

            <div className={classes.years}>
                <Typography variant={"body2"}>{"Selected Year(s) from the Dashboard:"}</Typography>
            </div>

            <div className={classes.yearsContent}>
                {years && <iframe
                    style={{border: "0px none", width: "100%", height: "100%"}}
                    src={"https://en.m.wikipedia.org/wiki/" + years[0].name}
                />}
            </div>
        </div>
    );
}

export const DASHBOARD_SALES: IDashboardInfo = {

    name: "Sales",
    path: "shared:/Embedded/Sales",

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

    openCaption: "Sales (Asia,Europe,North America)",
    openTooltip: "click to open the report with parameters: (Asia, Europe, North America)",

    interactions: Interactions,

}
