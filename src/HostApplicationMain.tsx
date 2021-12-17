import React, {useState} from 'react';
import {Card, CardActionArea, CardContent, Theme, Typography} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";
import DemoGlobalFilter from "./DemoGlobalFilter";
import DemoStandaloneDashboards from "./DemoStandaloneDashboards";

const styles = (theme: Theme) => createStyles({

    root: {

        position: "relative",

        width: "100%",
        height: "100%",

        backgroundColor: theme.palette.background.paper,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

});

type Demo = "STANDALONE_DASHBOARDS" | "APPLICATION";

const useStyles = makeStyles(styles);

export default function HostApplicationMain() {

    const classes = useStyles();

    const [demo, setDemo] = useState<Demo>();

    function handleStandaloneDashboardsClick() {
        setDemo("STANDALONE_DASHBOARDS");
    }

    function handleApplicationClick() {
        setDemo("APPLICATION")
    }

    if (demo == "STANDALONE_DASHBOARDS") {

        return <DemoStandaloneDashboards/>;

    } else if (demo === "APPLICATION") {

        return <DemoGlobalFilter/>;

    } else {
        return (
            <div className={classes.root}>

                <Card sx={{width: 400, maxWidth: 400, maxHeight: 200, margin: 1}}>
                    <CardActionArea onClick={handleStandaloneDashboardsClick}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Standalone Dashboards
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Demonstrate how to open standalone dashboards.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card sx={{width: 400, maxWidth: 400, maxHeight: 200, margin: 1}}>
                    <CardActionArea onClick={handleApplicationClick}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Application (i.e., Global Filter)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Demonstrate how to open a dashboards application to take advantage
                                of the global filter. The state of the global filter is kept when
                                the host application is opening a new dashboard.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

            </div>
        );
    }

}
