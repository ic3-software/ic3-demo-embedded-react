import {IDashboardInfo} from "./HostApplication";

/**
 * One way communication: Host => icCube
 *
 * The host is opening a dashboard.
 */
export const DASHBOARD_1_WAY: IDashboardInfo = {

    name: "1way",
    path: "shared:/Embedded/1way",

    openCaption: "1-way",

    interactions: () => {
        return null;
    }
}

