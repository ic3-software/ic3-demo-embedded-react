import React, {useCallback, useEffect, useState} from 'react';
import {IAppNotificationToken, IReportDefinition, IReporting} from '@ic3/reporting-api';
import {Box, Button, CircularProgress, useTheme} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface DemoPrintButtonProps {

    reporting?: IReporting;

    reportDef?: IReportDefinition | null;

}

export default function DemoPrintButton(props: DemoPrintButtonProps) {

    const {reporting, reportDef} = props;

    const [isOngoing, setIsOngoing] = useState<IAppNotificationToken>();

    const [showOngoing, setShowOngoing] = useState(false) /* delayed to prevent visual glitch when fast operation */;

    useEffect(() => {

        if (isOngoing) {
            const timer = setTimeout(() => setShowOngoing(true), 500);

            return () => {
                clearTimeout(timer);
            };

        } else {
            setShowOngoing(false);
        }

        return;

    }, [isOngoing]);

    const handlePrintDashboard = useCallback(() => {

        if (!isOngoing) {

            reporting?.fireAppNotification({type: "print-report-dialog"}, {
                onStarted: (token) => {
                    console.log("print started", token)
                    setIsOngoing(token);
                },
                onSuccess: (token) => {
                    console.log("print success", token)
                    setIsOngoing(undefined);
                },
                onError: (token, error) => {
                    console.log("print error", token, error)
                    setIsOngoing(undefined);
                }
            });

        } else {

            reporting?.cancelAppNotification(isOngoing) /* could display a dialog to confirm cancel */;

        }

    }, [reporting, isOngoing]);

    const theme = useTheme();

    return (
        <Button disabled={!reporting || !reportDef} variant={"outlined"} onClick={handlePrintDashboard}>
            {"Print Report"}
            {
                showOngoing && <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: 'rgba(66,66,66,0.6)',
                }}>
                    <CircularProgress size={"1.4em"}/>
                </Box>
            }
            {
                showOngoing && <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.9,
                    color: theme.palette.primary.main,
                    "&:hover": {
                        opacity: 0.9,
                    }
                }}>
                    <CloseIcon/>
                </Box>
            }
        </Button>
    );

}
