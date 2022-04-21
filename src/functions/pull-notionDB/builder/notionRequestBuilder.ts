import {Block} from "@tryfabric/martian/build/src/notion/blocks";
import {markdownToBlocks} from "@tryfabric/martian";
import {DatabaseItem} from "@functions/pull-notionDB/types/notion/databaseItem";

export class NotionRequestBuilder {
    private pull: PullRequest;
    private notionUserList: User[];
    private properties;

    constructor(pull: PullRequest, notionUserList: User[]) {
        this.pull = pull;
        this.notionUserList = notionUserList;
        this.properties = {};
    }

    public createRequestBody = (): DatabaseItem => {
        this.createProperties();

        return {
            parent: {database_id: process.env.NOTION_PULLS_DATABASE_ID},
            properties: {...this.properties},
            children: this.createBody()
        };
    }

    private createProperties = (): void => {
        this.createTitle();
        this.createCategory();
        this.createMergedAt();
        this.createAssignee();
        this.createURL();
    }

    private createTitle = (): void => {
        this.properties[process.env.NOTION_TILE_KEY] = {title: [{text: {content: this.pull.title}}]};
    }

    private createAssignee = (): void => {
        const assignee = this.notionUserList.find(u => u.githubUser === this.pull.assignee);
        if (!assignee) return;

        this.properties[process.env.NOTION_ASSIGNEE_KEY] = {people: assignee.notionUser};
    }

    private createCategory = (): void => {
        if (this.pull.labels.length === 0) return;

        this.properties[process.env.NOTION_CATEGORY_KEY] = {
            multi_select: this.pull.labels.map(l => {
                return {
                    name: l
                }
            })
        };
    }

    private createMergedAt = (): void => {
        let mergedAt = new Date(this.pull.mergedAt);
        mergedAt.setHours(mergedAt.getHours() + 9);
        this.properties[process.env.NOTION_MERGED_AT_KEY] = {
            date: {
                start: mergedAt,
                time_zone: "Asia/Tokyo"
            }
        }
    }

    private createURL = (): void => {
        this.properties[process.env.NOTION_URL_KEY] = {url: this.pull.url};
    }

    private createBody = (): Block[] => {
        const options = {allowUnsupportedObjectType: false, strictImageUrls: true};
        const body = markdownToBlocks(this.pull.description, options);
        return body;
    }
}