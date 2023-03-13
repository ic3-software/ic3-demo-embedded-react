import {
    DashboardsLoaderDivContext,
    IDashboardsLoaderDivParams,
    IDashboardsLoaderParams,
    IReporting
} from "@ic3/reporting-api-embedded";
import React from "react";

/**
 * An example of a class that allows for loading icCube libraries.
 *
 * icCube uses Webpack: loading the entry point (i.e., main.js) will start loading all initial chunks.
 *
 * You can create this context ASAP. Actually can be done at any point in your app life time before
 * any icCube rendering is required yet.
 */
export class DashboardsDivContext {

    private readonly context: DashboardsLoaderDivContext;

    constructor(options?: string | IDashboardsLoaderParams) {
        this.context = new DashboardsLoaderDivContext(options);
    }

    public getBuildVersion() {
        return this.context.getBuildVersion();
    }

    public getBuildTimeStamp() {
        return this.context.getBuildTimestamp();
    }

    public loadLibsAndInitialize(options: IDashboardsLoaderDivParams): Promise<IReporting> {
        return this.context.loadLibsAndInitialize(options);
    }

}

export const DashboardsDivReactContext = React.createContext<DashboardsDivContext>(null as any);