import React, {useCallback, useMemo, useState} from 'react';
import {Button, ButtonGroup} from "@mui/material";
import {IReportAppDefinition, IReportDefinition, IReporting, IReportParam} from '@ic3/reporting-api';
import {IDashboardInfo} from "../standalone/DemoDashboards";
import {DashboardsDiv} from "../common/DashboardsDiv";
import {styled} from "@mui/material/styles";
import EmbeddedTypeSwitch, {EmbeddedType} from "../common/EmbeddedTypeSwitch";
import {DashboardsFrame} from "../common/DashboardsFrame";

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .g-filter-doc": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    "& .g-filter-buttons": {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),

    },

    "& .g-filter-payload": {

        flex: 1,
        overflow: "hidden",

        padding: theme.spacing(4),

    },

}));


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

    // The icCube dashboards application as a IReporting instance.
    const [reporting, setReporting] = useState<IReporting>();

    const [appDef, setAppDef] = useState<IReportAppDefinition | null>();

    const handleOpenDashboard = useCallback((path: string, params?: IReportParam[]) => {

        return () => {

            reporting?.openReport({

                path, params,

                onDefinition: (report: IReportDefinition) => {
                    console.log("[ic3-demo] open-report:" + report.getPath());
                },

                onError: (error) => {
                    console.log("[ic3-demo] open-report:error", error);
                    return true /* handled */;
                }
            });
        }

    }, [reporting]);

    const [version, setVersion] = useState<string>("loading...");
    const [embeddedType, setEmbeddedType] = useState<EmbeddedType>("div");

    const introduction = useMemo(() => (

        <EmbeddedTypeSwitch className={"g-filter-doc"} type={embeddedType} version={version} onTypeChange={type => {

            setVersion("loading...");
            setAppDef(null);
            setEmbeddedType(type);

        }}/>

    ), [embeddedType, setEmbeddedType, version]);

    const buttons = useMemo(() => (
        <div className={"g-filter-buttons"}>

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

    ), [handleOpenDashboard, reporting, appDef]);

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

        ic3.openReportApp({
            path: "shared:/Embedded Global Filter",

            onDefinition: (app: IReportAppDefinition) => {
                console.log("[ic3-demo] open-app");
                setAppDef(app);
            },

            onError: (error) => {
                console.log("[ic3-demo] open-app:error", error);
                return true /* handled */;
            }

        });

    }, []);

    return (
        <StyledDiv>

            {introduction}
            {buttons}

            <div className={"g-filter-payload"}>
                {
                    iFrameBased
                        ? <DashboardsFrame containerId={"ic3-dashboards"} onReady={ic3ready} url={iFrameUrl}/>
                        : <DashboardsDiv uid={"ic3-demo-global-filter"} onReady={ic3ready}/>
                }
            </div>
        </StyledDiv>
    );

}
