import React from 'react';
import {IDashboardInfo, IDashboardInteractionProps} from "./DemoDashboards";
import {Autocomplete, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";

const StyledDiv = styled("div")(({theme}) => ({

    paddingTop: theme.spacing(4),
    color: theme.palette.text.primary,

}));

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

    const {reporting} = props;

    return (
        <StyledDiv>

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

        </StyledDiv>
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
