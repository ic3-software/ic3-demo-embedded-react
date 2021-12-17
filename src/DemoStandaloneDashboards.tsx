import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup, Theme, Typography} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";
import {IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api';
import {DashboardsFrame} from "./DashboardsFrame";
import {DASHBOARD_1_WAY} from "./Dashboard1way";
import {DASHBOARD_1_WAY_DYNAMIC_QUERY} from "./Dashboard1wayDynamicQuery";
import {DASHBOARD_2_WAY} from "./Dashboard2way";
import {DASHBOARD_2_WAY_FILTER_SYNC} from "./Dashboard2wayFilterSync";

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

export interface IDashboardInteractionProps {

    reporting: IReporting;

}

export interface IDashboardInfo {

    name: string;
    path: string;
    params?: IReportParam[];

    openCaption?: string;
    openTooltip?: string;

    interactions: React.JSXElementConstructor<IDashboardInteractionProps>;

}

const DASHBOARDS: IDashboardInfo[] = [
    DASHBOARD_1_WAY,
    DASHBOARD_1_WAY_DYNAMIC_QUERY,
    DASHBOARD_2_WAY,
    DASHBOARD_2_WAY_FILTER_SYNC,
];

const TIMESTAMP = new Date().getTime();

export default function DemoStandaloneDashboards() {

    const classes = useStyles();

    // The icCube dashboards application as a IReporting instance.
    const [reporting, setReporting] = useState<IReporting>();

    const [reportDef, setReportDef] = useState<IReportDefinition | null>();

    const handlePrintDashboard = useCallback(() => {

        return () => {

            reporting?.fireAppNotification({type: "print-report-dialog"});
        }

    }, [reporting]);

    const handleOpenDashboard = useCallback((path: string, params?: IReportParam[]) => {

        return () => {

            reporting?.openReport({

                path, params,

                onDefinition: (report: IReportDefinition) => {
                    console.log("[iFrame] open-report:" + report.getPath());
                    setReportDef(report);
                },

                onError: (error) => {
                    console.log("[iFrame] open-report:error", error);
                    setReportDef(null);
                    return true /* handled */;
                }
            });
        }

    }, [reporting]);

    const version = reporting ? ("v" + reporting.getVersion().getInfo()) : "loading...";

    const introduction = useMemo(() => (

        <div className={classes.doc}>

            <Typography variant={"body2"}>
                {"This application is demonstrating how to embed (and drive) icCube dashboards via an iFrame"}
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
                                disabled={!reporting || report.name === reportDef?.getName()}
                                variant={"outlined"}
                                onClick={handleOpenDashboard(report.path, report.params)}
                                title={report.openTooltip ?? "click to open the report"}
                        >
                            {report.openCaption ?? report.name}
                        </Button>
                    )
                })}
            </ButtonGroup>

            <ButtonGroup style={{paddingLeft: "16px"}} size={"medium"} variant={"text"}>
                <Button disabled={!reporting || !reportDef} variant={"outlined"} onClick={handlePrintDashboard()}>
                    {"Print Report"}
                </Button>
            </ButtonGroup>

        </div>

    ), [handleOpenDashboard, handlePrintDashboard, classes.buttons, reporting, reportDef]);

    const dashboardInfo = reportDef ? (

        <>
            <Typography variant={"body2"} color={"primary"}>
                {"name: " + reportDef.getName()}
            </Typography>
            <Typography variant={"body2"} color={"primary"}>
                {"path: " + reportDef.getPath()}
            </Typography>
        </>

    ) : reporting ? (

        <Typography variant={"body2"} color={"primary"}>
            {"select a report"}
        </Typography>

    ) : null;

    // Using an icCube FORM auth. w/ ic3demo activated for the sake of simplicity (this way no username/password
    // is being requested: the demo user - ic3demo configuration - is being used instead). Check the webpack.dev.js
    // reverse proxy configuration (livedemo.icCube.com) to prevent any CORS issue.

    const url = "/icCube/report/viewer?ic3nocache=" + TIMESTAMP + "&ic3demo=";

    const ic3ready = useCallback((ic3: IReporting) => {

        console.log("[iFrame] ic3ready : ", ic3);
        setReporting(ic3);

    }, []);

    const reportName = reportDef?.getName();

    const dashboardInteractions = useMemo(() => {

        if (!reporting) {
            return null;
        }

        const dashboard = DASHBOARDS.find(d => d.name === reportName);
        return dashboard ? <dashboard.interactions reporting={reporting}/> : null;

    }, [reporting, reportName]);

    return (
        <div className={classes.root}>

            {introduction}
            {buttons}

            <div className={classes.payload}>

                <div className={classes.interactions}>
                    {dashboardInfo}
                    {dashboardInteractions}
                </div>

                <div className={classes.dashboards}>
                    <DashboardsFrame containerId={"ic3dashboards"} onReady={ic3ready} url={url}/>
                </div>

            </div>
        </div>
    );

}
