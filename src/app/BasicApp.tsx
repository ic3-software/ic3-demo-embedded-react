import React from 'react';
import {DashboardsLoaderDivContext, IReporting} from '@ic3/reporting-api-embedded';

/**
 * This is a minimal example of how to embed a dashboard via a div.
 */
export default function BasicApp() {

    const [dashboardError, setDashboardError] = React.useState();
    useJwtTokenCallback();

    return <div style={{display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: 'auto'}}>
        <h1>
            My Application
        </h1>
        <div>
            {dashboardError}
        </div>
        <div>
            Dashboard
        </div>
        <div style={{minHeight: '500px', border: '2px solid lightgray'}}>
            <DashboardDivContext>
                <DashboardsDiv
                    uid={"id1"}
                    onError={setDashboardError}
                    onReady={reporting => reporting.openReport({path: "shared:/Embedded/1way"})}
                />
            </DashboardDivContext>
        </div>
        <div>
            Admin section
        </div>
        <div>
            <iframe id="ic3-iframe" width={"100%"} height={"900px"} src={"/icCube/console?ic3customHeaders=admin"}/>
        </div>
    </div>

}

export const DashboardsDivReactContext = React.createContext<DashboardsLoaderDivContext>(null as any);

/**
 * React component adding the dashboard context to the React tree.
 */
export function DashboardDivContext(props: { children: React.ReactNode }) {

    const context = React.useMemo(() => new DashboardsLoaderDivContext({
        customHeaders: "dashboards"
    }), []);

    return <DashboardsDivReactContext.Provider value={context}>
        {props.children}
    </DashboardsDivReactContext.Provider>

}

interface DashboardsDiv {

    /**
     * ID of the reporting instance
     */
    uid: string;

    onReady: (ic3: IReporting) => void;

    onError?: (reason: any) => void;

}

/**
 * Component for rendering a dashboard.
 */
export function DashboardsDiv(props: DashboardsDiv) {

    const {uid, onReady, onError} = props;

    const context = React.useContext(DashboardsDivReactContext);

    const refContainer = React.useRef<HTMLDivElement>(null);
    const [loadingReporting, setLoadingReporting] = React.useState(true);

    React.useEffect(() => {

        if (refContainer.current) {

            refContainer.current && context.loadLibsAndInitialize({
                uid,
                container: refContainer.current,
            })
                .then(onReady)
                .catch(onError)
                .finally(() => setLoadingReporting(false));

        }

    }, [context, refContainer, uid, onReady, onError]);

    return <>
        {loadingReporting && <div>Loading reporting ...</div>}
        <div ref={refContainer}/>
    </>
}

/**
 * Use this hook for passing the JWT token from your frontend application to icCube.
 */
function useJwtTokenCallback() {

    React.useEffect(() => {
        /**
         * Custom event listener for passing the JWT token to icCube. All private paths in /icCube get these headers attached.
         */
        const onEvent = (event: MessageEvent<any>) => {

            // Listen to the post message send by the icCube JS libraries.
            // The `type` of this message is `ic3-custom-headers-request`.

            const data = event.data;

            if (data.type === "ic3-custom-headers-request") {

                const embeddedDiv = (data.ic3callerType === "div");
                const ic3customheaders = data.ic3customheaders /* as specified in the URL */;

                // Post the reply to the window when embedding as DIV and to the iFrame otherwise.
                const target = !embeddedDiv
                    ? (document.getElementById("ic3-iframe") as any)?.["contentWindow"]
                    : window
                ;

                console.info('[CustomHeaders] demo <<< ic3-custom-headers-reply(' + ic3customheaders + ')');

                const accessToken = "JWT_TOKEN_ENCRYPTED";  // Pass this token to the reverse proxy. The reverse proxy validates the token.

                target && target.postMessage({

                    type: "ic3-custom-headers-reply",

                    data: {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    }

                }, document.location.origin);

            }
        }

        window.addEventListener("message", onEvent);

        return () => {
            window.removeEventListener("message", onEvent);
        }

    }, []);

}