import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup, Theme, Typography} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";
import {IReportAppDefinition, IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api';
import {DashboardsFrame} from "./DashboardsFrame";
import {IDashboardInfo} from "./DemoStandaloneDashboards";

const styles = (theme: Theme) => createStyles({

    root: {

        position: "relative",

        width: "100%",
        height: "100%",

        backgroundColor: theme.palette.background.paper,

        display: "flex",
        flexDirection: "column",

    },

    doc: {

        display: "flex",
        flexDirection: "row",

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    buttons: {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),

    },

    payload: {

        flex: 1,
        overflow: "hidden",

        display: "flex",
        flexDirection: "row",

    },

    interactions: {

        overflow: "hidden",

        width: "384px",
        height: "100%",

        padding: theme.spacing(4),

        display: "flex",
        flexDirection: "column",

    },

    dashboards: {

        flex: 1,
        overflow: "hidden",

        padding: theme.spacing(4),

    },

});

const useStyles = makeStyles(styles);

const DASHBOARDS: IDashboardInfo[] = [
    {
        name: "Sales per Cities",
        path: "shared:/Embedded/Global Filter/Sales per Cities",

        openCaption: "Sales per Cities",

        interactions: () => {
            return null;
        }
    },
    {
        name: "Sales per Years",
        path: "shared:/Embedded/Global Filter/Sales per Years",

        openCaption: "Sales per Years",

        interactions: () => {
            return null;
        }
    }
];

const TIMESTAMP = new Date().getTime();

export default function DemoGlobalFilter() {

    const classes = useStyles();

    // The icCube dashboards application as a IReporting instance.
    const [reporting, setReporting] = useState<IReporting>();
    const [appDef, setAppDef] = useState<IReportAppDefinition>();

    const version = reporting ? ("v" + reporting.getVersion().getInfo()) : "loading...";

    const handleOpenDashboard = useCallback((path: string, params?: IReportParam[]) => {

        return () => {

            reporting?.openReport({

                path, params,

                onDefinition: (report: IReportDefinition) => {
                    console.log("[iFrame] open-report:" + report.getPath());
                },

                onError: (error) => {
                    console.log("[iFrame] open-report:error", error);
                    return true /* handled */;
                }
            });
        }

    }, [reporting]);

    const introduction = useMemo(() => (

        <div className={classes.doc}>

            <Typography variant={"body2"}>
                {"This application is demonstrating how to embed (and drive) icCube application (i.e., global filter) via an iFrame"}
            </Typography>
            <Typography variant={"body2"} color={"primary"} style={{paddingLeft: "10px"}}>
                {version}
            </Typography>

        </div>

    ), [classes.doc, version]);

    const buttons = useMemo(() => (
        <div className={classes.buttons}>

            <ButtonGroup size={"medium"} variant={"text"}>
                {DASHBOARDS.map((report, index) => {
                    return (
                        <Button key={index}
                                disabled={!reporting || !appDef}
                                variant={"outlined"}
                                onClick={handleOpenDashboard(report.path, report.params)}
                                title={report.openTooltip ?? "click to open the report"}
                        >
                            {report.openCaption ?? report.name}
                        </Button>
                    )
                })}
            </ButtonGroup>

        </div>

    ), [handleOpenDashboard, classes.buttons, reporting, appDef]);

    // Using an icCube FORM auth. w/ ic3demo activated for the sake of simplicity (this way no username/password
    // is being requested: the demo user - ic3demo configuration - is being used instead). Check the webpack.dev.js
    // reverse proxy configuration (livedemo.icCube.com) to prevent any CORS issue.

    const url = "/icCube/report/viewer?ic3nocache=" + TIMESTAMP + "&ic3demo=";

    const ic3ready = useCallback((ic3: IReporting) => {

        console.log("[iFrame] ic3ready : ", ic3);
        setReporting(ic3);

        ic3.openReportApp({
            path: "shared:/Embedded Global Filter",

            onDefinition: (app: IReportAppDefinition) => {
                console.log("[iFrame] open-app");
                setAppDef(app);
            },

            onError: (error) => {
                console.log("[iFrame] open-app:error", error);
                return true /* handled */;
            }

        });

    }, []);

    return (
        <div className={classes.root}>

            {introduction}
            {buttons}

            <div className={classes.payload}>

                <div className={classes.dashboards}>
                    <DashboardsFrame containerId={"ic3dashboards"} onReady={ic3ready} url={url}/>
                </div>

            </div>
        </div>
    );

}
