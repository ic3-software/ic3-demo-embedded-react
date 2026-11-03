import {HostLogger} from "../HostLogger";
import {DashboardsDiv} from "../common/DashboardsDiv";
import React from 'react';
import {IReporting} from '@ic3/reporting-api-embedded';
import {styled} from "@mui/material/styles";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .my-host-app": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    "& .ic3Dashboard-dashboards": {

        flex: 1,
        overflow: "hidden",

        padding: theme.spacing(4),

    },

}));

export default function DemoChatApp() {

    // These records are added as context to each question in the AI conversation. Use this to forward info from the
    // host app into the AI chat.
    const aiContext = React.useRef({
        // E.g., host app filters
        "hostAppFilter": "year: 2023"
    });

    const ic3ready = React.useCallback((ic3: IReporting) => {
        HostLogger.info("Host", "ic3ready : ", ic3);
        ic3.openChat({getAiContext: () => aiContext.current});
    }, []);

    return (
        <StyledDiv>
            <div className="my-host-app">
                This part is the host application
            </div>
            <DashboardsDiv
                className={"ic3Dashboard-dashboards"}
                uid={"ic3-demo"}
                onReady={ic3ready}
            />
        </StyledDiv>
    );

}