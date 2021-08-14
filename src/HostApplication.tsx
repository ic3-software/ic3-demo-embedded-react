import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup, Theme, Typography} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/styles";
import {IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api';
import {DashboardsFrame} from "./DashboardsFrame";
import {DASHBOARD_SALES} from "./SalesDashboard";
import {DASHBOARD_DONUTS} from "./DonutsDashboard";
import {DASHBOARD_FILTER} from "./FilterDashboard";
import {DASHBOARD_QUERIES} from "./QueriesDashboard";

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

const DASHBOARDS: IDashboardInfo[] = [DASHBOARD_DONUTS, DASHBOARD_SALES, DASHBOARD_FILTER, DASHBOARD_QUERIES];

const TIMESTAMP = new Date().getTime();

export default function HostApplication() {

    const classes = useStyles();

    // The icCube dashboards application as a IReporting instance.
    const [reporting, setReporting] = useState<IReporting>();

    const [reportDef, setReportDef] = useState<IReportDefinition | null>();

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

        </div>

    ), [handleOpenDashboard, classes.buttons, reporting, reportDef]);

    const dashboardInfo = reportDef ? (

        <Typography variant={"body2"} color={"primary"}>
            {reportDef.getName()}
        </Typography>

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
