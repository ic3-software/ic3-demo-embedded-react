import React, {useContext, useEffect, useRef, useState} from 'react';
import {IDashboardsLoaderDivParams, IReporting, FilterPanelViewStorageFactory} from '@ic3/reporting-api-embedded';
import {DashboardsDivReactContext} from "./DashboardsDivContext";

interface DashboardsDiv {

    uid: string;

    className?: string;

    onReady: (ic3: IReporting) => void;

    autoResize?: boolean;

    filterPanelViewStorageFactory?: FilterPanelViewStorageFactory;

}


export function DashboardsDiv(props: DashboardsDiv) {

    const {uid, className, onReady, autoResize} = props;

    const context = useContext(DashboardsDivReactContext);

    const refContainer = useRef<HTMLDivElement>(null);

    const [error, setError] = useState<string>("");

    useEffect(() => {

        if (refContainer.current) {

            const options: IDashboardsLoaderDivParams = {
                uid,
                container: refContainer.current,
                resizingContainer: autoResize ? refContainer.current : undefined,
                filterPanelViewStorageFactory: props.filterPanelViewStorageFactory
            }

            refContainer.current && context.loadLibsAndInitialize(options)
                .then(onReady)
                .catch(reason => setError(reason));

        }

    }, [context, refContainer, setError, uid, onReady, autoResize, props.filterPanelViewStorageFactory]);

    return <div className={className} ref={refContainer}>{error}</div>;
}