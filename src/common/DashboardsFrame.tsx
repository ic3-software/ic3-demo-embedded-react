import React, {useEffect} from 'react';
import {DashboardsLoaderFrame, IReporting} from '@ic3/reporting-api';

interface DashboardsFrame {

    /**
     * An unique ID (DOM) that is identifying the icCube dashboards instance.
     */
    containerId: string;

    /**
     * E.g., useful when using custom headers from the host application.
     */
    frameId: string;

    onReady: (ic3: IReporting) => void;

    url: string;

}

export function DashboardsFrame(props: DashboardsFrame) {

    const {containerId, frameId, onReady, url} = props;

    useEffect(() => {

        DashboardsLoaderFrame({containerId, frameId, onReady, url});

    }, [containerId, frameId, onReady, url]);

    return <div id={containerId} style={{width: "100%", height: "100%"}}/>;
}