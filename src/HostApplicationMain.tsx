import React, {useCallback, useMemo, useState} from 'react';
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import DemoGlobalFilter from "./globalfilter/DemoGlobalFilter";
import DemoDashboards from "./standalone/DemoDashboards";
import {DashboardsDivContext, DashboardsDivReactContext} from "./common/DashboardsDivContext";
import {styled} from "@mui/material/styles";
import DoubleDiv from "./doublediv/DoubleDiv";
import DemoAdmin from './admin/DemoAdmin';
import {withCustomHeaders} from "./index";
import BasicApp from "./app/BasicApp";

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

type Demo = "ADMIN_CONSOLE" | "STANDALONE_DASHBOARDS" | "APPLICATION" | "DOUBLE_DIV" | "APP_EXAMPLE";

export default function HostApplicationMain() {

    const [demo, setDemo] = useState<Demo>();

    const handleAdminConsoleClick = useCallback(() => {
        setDemo("ADMIN_CONSOLE");
    }, []);

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

        if (demo == "ADMIN_CONSOLE") {

            return <DemoAdmin/>;

        } else if (demo == "STANDALONE_DASHBOARDS") {

            return <DemoDashboards/>;

        } else if (demo === "APPLICATION") {

            return <DemoGlobalFilter/>;

        } else if (demo === "DOUBLE_DIV") {

            return <DoubleDiv/>;

        } else if (demo === "APP_EXAMPLE") {

            return <BasicApp/>;

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

                    <Card sx={{width: 500, margin: 1}}>
                        <CardActionArea onClick={handleAdminConsoleClick}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Standalone Admin. Console
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Demonstrate how to open the Admin. console (iFrame).
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card sx={{width: 500, margin: 1}}>
                        <CardActionArea onClick={() => setDemo("APP_EXAMPLE")}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Basic React application example
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Basic setup for how to embed icCube via a div with React.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                </StyledDiv>
            );

        }

    }, [demo, handleApplicationClick, handleStandaloneDashboardsClick, handleDoubleDiv, handleAdminConsoleClick]);

    // -----------------------------------------------------------------------------------------------------------------
    // In a production environment the user would be authenticated by the host application and
    // icCube would be configured to retrieve those credentials.
    //
    // For the sake of simplicity, the icCube server used by this demo is being configured to accept
    // the ?ic3demo URL parameter meaning the configured ic3demo user is going to be used.
    // -----------------------------------------------------------------------------------------------------------------

    const suffix = "?ic3demo";

    //  Embedding icCube using a DIV.

    // Setup very early in order to load as early as possible icCube libraries
    // (actually before any icCube rendering is required yet).

    const context = useMemo(() => new DashboardsDivContext({
        customHeaders: withCustomHeaders ? "dashboards" : undefined,
        urlSuffix: suffix,
    }), []);

    return <DashboardsDivReactContext.Provider value={context}>
        {content}
    </DashboardsDivReactContext.Provider>

}
