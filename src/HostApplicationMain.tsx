import React, {useCallback, useMemo, useState} from 'react';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import DemoGlobalFilter from "./globalfilter/DemoGlobalFilter";
import DemoDashboards from "./standalone/DemoDashboards";
import {DashboardsDivContext, DashboardsDivReactContext} from "./common/DashboardsDivContext";
import {styled} from "@mui/material/styles";
import DoubleDiv from "./doublediv/DoubleDiv";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

type Demo = "STANDALONE_DASHBOARDS" | "APPLICATION" | "DOUBLE_DIV";

export default function HostApplicationMain() {

    const [demo, setDemo] = useState<Demo>();

    const handleStandaloneDashboardsClick = useCallback(() => {
        setDemo("STANDALONE_DASHBOARDS");
    }, []);

    const handleApplicationClick = useCallback(() => {
        setDemo("APPLICATION")
    }, []);

    const handleDoubleDiv = useCallback(() => {
        setDemo("DOUBLE_DIV")
    }, []);

    const content = useMemo(() => {

        if (demo == "STANDALONE_DASHBOARDS") {

            return <DemoDashboards/>;

        } else if (demo === "APPLICATION") {

            return <DemoGlobalFilter/>;

        } else if (demo === "DOUBLE_DIV") {

            return <DoubleDiv/>;

        } else {

            return (
                <StyledDiv>
                    <Card sx={{width: 500, margin: 1}}>
                        <CardActionArea onClick={handleStandaloneDashboardsClick}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Standalone Dashboards
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Demonstrate how to open standalone dashboards.
                                    Use either DIV or iFrame integration.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card sx={{width: 500, margin: 1}}>
                        <CardActionArea onClick={handleApplicationClick}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Application (i.e., Global Filter)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Demonstrate how to open a dashboards application to take advantage
                                    of the global filter. The state of the global filter is kept when
                                    the host application is opening a new dashboard.
                                    Use either DIV or iFrame integration.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card sx={{width: 500, margin: 1}}>
                        <CardActionArea onClick={handleDoubleDiv}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Multiple Dashboards
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Demonstrate how to open two dashboards and make them communicate
                                    to each other. Use DIV integration.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                </StyledDiv>
            );

        }

    }, [demo, handleApplicationClick, handleStandaloneDashboardsClick, handleDoubleDiv]);

    // In a production environment the user would be authenticated by the host application and
    // a HTTP reverse proxy would be taking care of passing credentials to icCube.

    // But for the sake of simplicity and to make it work easily w/ the Webpack dev. server,
    // icCube is being configured to accept ?ic3demo URL parameter meaning the ic3demo user
    // is going to be used.

    // Check the webpack.dev.js reverse proxy configuration (livedemo.icCube.com) to prevent
    // any CORS issue.

    const suffix = "?ic3demo";

    //  Embedding icCube using a DIV.

    // Setup very early in order to load as early as possible icCube libraries
    // (actually before any icCube rendering is required yet).

    const context = useMemo(() => new DashboardsDivContext(suffix), []);

    return <DashboardsDivReactContext.Provider value={context}>
        {content}
    </DashboardsDivReactContext.Provider>

}
