import React, {useCallback, useMemo, useState} from 'react';
import {IReportDefinition, IReporting} from '@ic3/reporting-api-embedded';
import {DashboardsDiv} from "../common/DashboardsDiv";
import {styled} from "@mui/material/styles";
import {Typography} from "@mui/material";
import {HostLogger} from '../HostLogger';

const StyledDiv = styled("div")(({theme}) => ({

    position: "relative",

    width: "100%",
    height: "100%",

    backgroundColor: theme.palette.background.paper,

    display: "flex",
    flexDirection: "column",

    "& .ic3Dashboard-doc": {

        padding: theme.spacing(4),
        color: theme.palette.text.primary,

    },

    "& .ic3Dashboard-doc-2": {

        display: "flex",
        flexDirection: "column",

        paddingTop: theme.spacing(4),
        paddingLeft: theme.spacing(4),

    },

    "& .ic3Dashboard-payload": {

        flex: 1,
        overflow: "hidden",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),

    },

    "& .ic3Double-div-1": {
        height: "100px",
        width: "48%"
    },

    "& .ic3Double-div-2": {
        height: "100px",
        width: "48%"
    },

}));


export default function DoubleDiv() {

    // The icCube dashboards application as a IReporting instances.
    //      one separate instance for each DIV: chart (left) & table (right).

    const [repChart, setRepChart] = useState<IReporting>();
    const [repTable, setRepTable] = useState<IReporting>();

    useMemo(() => {

        if (repChart && repTable) {

            // Forwards events from one dashboard to the other one.

            repChart.onEvent("country", (eventContent) => repTable.fireEvent("country", eventContent));
            repTable.onEvent("years", (eventContent) => repChart.fireEvent("years", eventContent));

        }

    }, [repChart, repTable])

    const ic3ready1 = useCallback((ic3: IReporting) => {

        const path = "shared:/Embedded/singleChart";

        ic3.openReport({

            path,

            onDefinition: (report: IReportDefinition) => {
                HostLogger.info("Host", "div-1 open-report:" + report.getPath());
            },

            onError: (error) => {
                HostLogger.error("Host", "div-1 open-report on error:" + error);
                return true;
            }
        });

        setRepChart(ic3);


    }, []);

    const ic3ready2 = useCallback((ic3: IReporting) => {

        const path = "shared:/Embedded/singleTable";

        ic3.openReport({

            path,

            onDefinition: (report: IReportDefinition) => {
                HostLogger.info("Host", "div-2 open-report:" + report.getPath());
            },

            onError: (error) => {
                HostLogger.error("Host", "div-2 open-report on error:" + error);
                return true;
            }
        });

        setRepTable(ic3);

    }, []);

    return <>
        <StyledDiv>
            <div className={"ic3Dashboard-doc"}>
                <Typography variant={"body2"}>
                    {"This application is demonstrating how to embed (and drive) two icCube dashboards and make them communicate to each other:"}
                </Typography>
                <div className={"ic3Dashboard-doc-2"}>
                    <Typography variant={"body2"}>
                        {"- the chart is firing a country event that is filtering the table."}
                    </Typography>
                    <Typography variant={"body2"}>
                        {"- the table is firing a year event that is filtering the chart."}
                    </Typography>
                </div>
            </div>
            <div className={"ic3Dashboard-payload"}>
                <DashboardsDiv className={"ic3Double-div-1"} uid={"ic3-demo-div-one"} onReady={ic3ready1}
                               autoResize={true}/>
                <DashboardsDiv className={"ic3Double-div-2"} uid={"ic3-demo-div-two"} onReady={ic3ready2}
                               autoResize={true}/>
            </div>
        </StyledDiv>
    </>;

}
