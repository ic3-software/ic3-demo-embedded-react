import React, {useEffect} from 'react';
import {DashboardsLoaderFrame, IReporting} from '@ic3/reporting-api';

const style = {

    width: "100%",
    height: "100%",

}

interface DashboardsFrame {

    /**
     * An unique ID (DOM) that is identifying the icCube dashboards instance.
     */
    containerId: string;
    onReady: (ic3: IReporting) => void;
    url: string;

}

export function DashboardsFrame(props: DashboardsFrame) {

    const {containerId, onReady, url} = props;

    useEffect(() => {

        DashboardsLoaderFrame({containerId, onReady, url});

    }, [containerId, onReady, url]);

    return <div id={containerId} style={style}/>;
}