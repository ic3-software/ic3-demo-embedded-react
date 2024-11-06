import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup, Typography} from "@mui/material";
import {IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api-embedded';
import {DASHBOARD_1_WAY} from "./Dashboard1way";
import {DASHBOARD_1_WAY_DYNAMIC_QUERY} from "./Dashboard1wayDynamicQuery";
import {DASHBOARD_2_WAY} from "./Dashboard2way";
import {DASHBOARD_2_WAY_FILTER_SYNC} from "./Dashboard2wayFilterSync";
import {DashboardsDiv} from "../common/DashboardsDiv";
import {DashboardsFrame} from "../common/DashboardsFrame";
import {styled} from "@mui/material/styles";
import EmbeddedTypeSwitch, {EmbeddedType} from "../common/EmbeddedTypeSwitch";
import {HostLogger} from '../HostLogger';
import {withCustomHeaders} from "../index";
import DemoPrintButton from "./DemoPrintButton";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .ic3Dashboard-doc": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    "& .ic3Dashboard-buttons": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),

    },

    "& .ic3Dashboard-payload": {

        flex: 1,
        overflow: "hidden",

        display: "flex",
        flexDirection: "row",

    },

    "& .ic3Dashboard-interactions": {

        overflow: "hidden",

        width: "384px",
        height: "100%",

        padding: theme.spacing(4),

        display: "flex",
        flexDirection: "column",

    },

    "& .ic3Dashboard-dashboards": {

        flex: 1,
        overflow: "hidden",

        padding: theme.spacing(4),

    },

}));

export interface IDashboardInteractionProps {

    reporting: IReporting;

}

export interface IDashboardDefinition {

    name: string;
    path: string;

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

    const [reportDef, setReportDef] = useState<IDashboardDefinition | null>();

    const handleOpenDashboard = useCallback((path: string, params?: IReportParam[]) => {

        return () => {

            reporting?.openReport({

                path, params,

                disableDefaultSchemaAuthCheck: true,

                onDefinition: (report: IReportDefinition) => {
                    HostLogger.info("Host", "open-report:" + report.getPath());

                    // Does not keep a local copy of 'report' as it might contain a proxy
                    // that will be revoked later.
                    setReportDef({name: report.getName(), path: report.getPath()});

                },

                onError: (error) => {
                    HostLogger.error("Host", "open-report:error", error);
                    setReportDef(null);
                    return true /* handled */;
                }
            });
        }

    }, [reporting]);

    const [version, setVersion] = useState<string>("loading...");
    const [embeddedType, setEmbeddedType] = useState<EmbeddedType>("div");

    const introduction = useMemo(() => (

        <EmbeddedTypeSwitch className={"ic3Dashboard-doc"} type={embeddedType} version={version} onTypeChange={type => {

            setVersion("loading...");
            setReportDef(null);
            setEmbeddedType(type);

        }}/>

    ), [embeddedType, setEmbeddedType, version]);

    const buttons = useMemo(() => (
        <div className={"ic3Dashboard-buttons"}>

            <ButtonGroup size={"medium"} variant={"text"}>
                {DASHBOARDS.map((report, index) => {
                    return (
                        <Button key={index}
                                disabled={!reporting || report.name === reportDef?.name}
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
                <DemoPrintButton reporting={reporting} reportDef={reportDef}/>
            </ButtonGroup>

        </div>

    ), [handleOpenDashboard, reporting, reportDef]);

    const dashboardInfo = reportDef ? (

        <>
            <Typography variant={"body2"} color={"primary"}>
                {reportDef.name}
            </Typography>
            <Typography variant={"body2"} color={"primary"}>
                {reportDef.path}
            </Typography>
        </>

    ) : reporting ? (

        <Typography variant={"body2"} color={"primary"}>
            {"select a report"}
        </Typography>

    ) : null;

    const ic3configuration = "&ic3configuration=dashboards";
    const ic3customHeaders = withCustomHeaders ? "&ic3customHeaders=dashboards" : "";

    // -----------------------------------------------------------------------------------------------------------------
    // In a production environment the user would be authenticated by the host application and
    // icCube would be configured to retrieve those credentials.
    //
    // For the sake of simplicity, the icCube server used by this demo is being configured to accept
    // the ?ic3demo URL parameter meaning the configured ic3demo user is going to be used.
    // -----------------------------------------------------------------------------------------------------------------

    const iFrameUrl = "/icCube/report/viewer?ic3nocache=" + TIMESTAMP + "&ic3demo=" + ic3customHeaders + ic3configuration;
    const iFrameBased = (embeddedType !== 'div');

    const ic3ready = useCallback((ic3: IReporting) => {

        HostLogger.info("Host", "ic3ready : ", ic3);

        setReporting(ic3);
        setVersion("v" + ic3.getVersion().getInfo());

    }, []);

    const reportName = reportDef?.name;

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

            <div className={"ic3Dashboard-payload"}>

                <div className={"ic3Dashboard-interactions"}>
                    {dashboardInfo}
                    {dashboardInteractions}
                </div>

                {
                    iFrameBased

                        ? <div className={"ic3Dashboard-dashboards"}>
                            <DashboardsFrame containerId={"ic3-dashboards"}
                                             frameId={"ic3-iframe"}
                                             onReady={ic3ready}
                                             url={iFrameUrl}
                            />
                        </div>

                        : <DashboardsDiv
                            className={"ic3Dashboard-dashboards"}
                            uid={"ic3-demo"}
                            onReady={ic3ready}
                        />
                }

            </div>
        </StyledDiv>
    );

}
