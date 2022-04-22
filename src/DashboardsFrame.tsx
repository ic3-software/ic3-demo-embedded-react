import React, {useEffect} from 'react';
import {DashboardsLoaderFrame, IReporting} from '@ic3/reporting-api';

interface DashboardsFrame {

    /**
     * An unique ID (DOM) that is identifying the icCube dashboards instance.
     */
    containerId: string;

    /**
     * Optional CSS class of the created iFrame.
     */
    className?: string;

    /**
     * Optional CSS inline styling of the created iFrame.
     */
    style?: Partial<CSSStyleDeclaration>;

    onReady: (ic3: IReporting) => void;

    url: string;

}

export function DashboardsFrame(props: DashboardsFrame) {

    const {containerId, className, style, onReady, url} = props;

    useEffect(() => {

        DashboardsLoaderFrame({containerId, className, style, onReady, url});

    }, [containerId, className, style, onReady, url]);

    return <div id={containerId} style={{width: "100%", height: "100%"}}/>;
}