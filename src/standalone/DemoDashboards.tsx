import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup, Typography} from "@mui/material";
import {IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api';
import {DASHBOARD_1_WAY} from "./Dashboard1way";
import {DASHBOARD_1_WAY_DYNAMIC_QUERY} from "./Dashboard1wayDynamicQuery";
import {DASHBOARD_2_WAY} from "./Dashboard2way";
import {DASHBOARD_2_WAY_FILTER_SYNC} from "./Dashboard2wayFilterSync";
import {DashboardsDiv} from "../common/DashboardsDiv";
import {DashboardsFrame} from "../common/DashboardsFrame";
import {styled} from "@mui/material/styles";
import EmbeddedTypeSwitch, {EmbeddedType} from "../common/EmbeddedTypeSwitch";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .dashboard-doc": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    "& .dashboard-buttons": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),

    },

    "& .dashboard-payload": {

        flex: 1,
        overflow: "hidden",

        display: "flex",
        flexDirection: "row",

    },

    "& .dashboard-interactions": {

        overflow: "hidden",

        width: "384px",
        height: "100%",

        padding: theme.spacing(4),

        display: "flex",
        flexDirection: "column",

    },

    "& .dashboard-dashboards": {

        flex: 1,
        overflow: "hidden",

        padding: theme.spacing(4),

    },

}));

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

export default function DemoDashboards() {

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
                    console.log("[ic3-demo] open-report:" + report.getPath());
                    setReportDef(report);
                },

                onError: (error) => {
                    console.log("[ic3-demo] open-report:error", error);
                    setReportDef(null);
                    return true /* handled */;
                }
            });
        }

    }, [reporting]);

    const [version, setVersion] = useState<string>("loading...");
    const [embeddedType, setEmbeddedType] = useState<EmbeddedType>("div");

    const introduction = useMemo(() => (

        <EmbeddedTypeSwitch className={"dashboard-doc"} type={embeddedType} version={version} onTypeChange={type => {

            setVersion("loading...");
            setReportDef(null);
            setEmbeddedType(type);

        }}/>

    ), [embeddedType, setEmbeddedType, version]);

    const buttons = useMemo(() => (
        <div className={"dashboard-buttons"}>

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

    ), [handleOpenDashboard, handlePrintDashboard, reporting, reportDef]);

    const dashboardInfo = reportDef ? (

        <>
            <Typography variant={"body2"} color={"primary"}>
                {reportDef.getName()}
            </Typography>
            <Typography variant={"body2"} color={"primary"}>
                {reportDef.getPath()}
            </Typography>
        </>

    ) : reporting ? (

        <Typography variant={"body2"} color={"primary"}>
            {"select a report"}
        </Typography>

    ) : null;

    // In a production environment the user would be authenticated by the host application and
    // a HTTP reverse proxy would be taking care of passing credentials to icCube.

    // But for the sake of simplicity and to make it work easily w/ the Webpack dev. server,
    // icCube is being configured to accept ?ic3demo URL parameter meaning the ic3demo user
    // is going to be used.

    // Check the webpack.dev.js reverse proxy configuration (livedemo.icCube.com) to prevent
    // any CORS issue.

    const iFrameUrl = "/icCube/report/viewer?ic3nocache=" + TIMESTAMP + "&ic3demo=";
    const iFrameBased = (embeddedType !== 'div');

    const ic3ready = useCallback((ic3: IReporting) => {

        console.log("[ic3-demo] ic3ready : ", ic3);

        setReporting(ic3);
        setVersion("v" + ic3.getVersion().getInfo());

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
        <StyledDiv>

            {introduction}
            {buttons}

            <div className={"dashboard-payload"}>

                <div className={"dashboard-interactions"}>
                    {dashboardInfo}
                    {dashboardInteractions}
                </div>

                {
                    iFrameBased ?
                        <div className={"dashboard-dashboards"}>
                            <DashboardsFrame containerId={"ic3-dashboards"} onReady={ic3ready} url={iFrameUrl}/>
                        </div>
                        :
                        <DashboardsDiv className={"dashboard-dashboards"} uid={"ic3-demo"} onReady={ic3ready}/>
                }

            </div>
        </StyledDiv>
    );

}
