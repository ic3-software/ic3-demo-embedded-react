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

    // In a production environment the user would be authenticated by the host application and
    // a HTTP reverse proxy would be taking care of passing credentials to icCube.

    // But for the sake of simplicity and to make it work easily w/ the Webpack dev. server,
    // icCube is being configured to accept ?ic3demo URL parameter meaning the ic3demo user
    // is going to be used.

    // Check the webpack.dev.js reverse proxy configuration (livedemo.icCube.com) to prevent
    // any CORS issue.

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
