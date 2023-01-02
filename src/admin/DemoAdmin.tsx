import React from 'react';
import {styled} from "@mui/material/styles";
import {withCustomHeaders} from "../index";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .ic3Dashboard-payload": {

        flex: 1,
        overflow: "hidden",

    },

}));

const TIMESTAMP = new Date().getTime();

export default function DemoAdmin() {

    // -----------------------------------------------------------------------------------------------------------------
    // In a production environment the user would be authenticated by the host application and
    // icCube would be configured to retrieve those credentials.
    //
    // For the sake of simplicity, the icCube server used by this demo is being configured to accept
    // the ?ic3demo URL parameter meaning the configured ic3demo user is going to be used.
    // -----------------------------------------------------------------------------------------------------------------

    const ic3configuration = "&ic3configuration=admin";
    const ic3customHeaders = withCustomHeaders ? "&ic3customHeaders=admin" : "";

    const iFrameUrl = "/icCube/console/?ic3nocache=" + TIMESTAMP + "&ic3demo=" + ic3customHeaders + ic3configuration;

    return (
        <StyledDiv>

            <div className={"ic3Dashboard-payload"}>
                <iframe id="ic3-iframe" width={"100%"} height={"100%"} src={iFrameUrl}></iframe>
            </div>
        </StyledDiv>
    );

}
