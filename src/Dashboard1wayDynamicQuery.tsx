import React from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./DemoStandaloneDashboards";
import {createStyles, makeStyles} from "@mui/styles";
import {Autocomplete, TextField, Theme} from "@mui/material";

const styles = (theme: Theme) => createStyles({

    root: {

        paddingTop: theme.spacing(4),
        color: theme.palette.text.primary,

    },

});

const useStyles = makeStyles(styles);

export const QUERIES_NAME = [

    "Continents",
    "Articles"

];

export const QUERIES_MDX = [

    "select\n" +
    "  [Measures].[#Sales] on 0\n" +
    "  [Geography].[Geography].[Continent] on 1\n" +
    "\n" +
    "from [Sales]",

    "select\n" +
    "  [Measures].[#Sales] on 0\n" +
    "  [Product].[Product].[Article] on 1\n" +
    "\n" +
    "from [Sales]"

];

function Interactions(props: IDashboardInteractionProps) {

    const classes = useStyles();

    const {reporting} = props;

    return (
        <div className={classes.root}>

            <Autocomplete

                fullWidth size={"small"} options={QUERIES_NAME}

                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="query"/>
                )}

                onChange={(event, value) => {

                    if (value) {

                        const mdx = (value === "Continents") ? QUERIES_MDX[0] : QUERIES_MDX[1];

                        reporting.fireEvent("mdx", {caption: value, name: mdx, uniqueName: mdx});

                    } else {

                        reporting.fireEvent("mdx", null);

                    }

                }}
            />

        </div>
    );
}

/**
 * One way communication: Host => icCube
 *
 * The host is generating the query being sent to icCube.
 */
export const DASHBOARD_1_WAY_DYNAMIC_QUERY: IDashboardInfo = {

    name: "1wayDynamicQuery",
    path: "shared:/Embedded/1wayDynamicQuery",

    openCaption: "1-way Dynamic Query",

    interactions: Interactions,

}
