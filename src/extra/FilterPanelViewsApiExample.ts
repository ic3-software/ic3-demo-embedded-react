import {FilterPanelViewStorage, FilterPanelViewStorageFactory} from '@ic3/reporting-api-embedded';


export default class FilterPanelViewsApiExample implements FilterPanelViewStorageFactory {

    getViewStorage(schemaName: string, cubeName: string | undefined): FilterPanelViewStorage {
        return new FilterPanelViewsApiImpl(schemaName, cubeName);
    };

}

/**
 * Example implementation of the filter panel views API.
 */
class FilterPanelViewsApiImpl implements FilterPanelViewStorage {

    private readonly schemaName: string;
    private readonly cubeName: string | undefined;

    constructor(schemaName: string, cubeName: string | undefined) {
        this.schemaName = schemaName;
        this.cubeName = cubeName;
    }

    getSchemaName() {
        return this.schemaName;
    }

    getCubeName() {
        return this.cubeName;
    }

    async getViews() {
        return ['view 1', 'view 2', 'view 3'];
    }

    async saveView(viewName: string, viewData: string) {
        console.log("saveView", viewName, viewData);
    }

    async deleteView(viewName: string) {
        console.log("deleteView", viewName);
    }

    async getView(viewName: string) {
        console.log("getView", viewName);
        return 'view 1';
    }

    additionalActions() {
        return [{
            id: 'manage',
            caption: "Manage Views",
            callback: () => {
                console.log("additionalActions", "Manage Views clicked!");
            },
            icon: "OpenInBrowser"
        }]
    }

}