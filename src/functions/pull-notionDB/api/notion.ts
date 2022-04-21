import {Client} from '@notionhq/client';
import {QueryDatabaseResponse} from "@notionhq/client/build/src/api-endpoints";
import {
    NotionRequestBuilder
} from "@functions/pull-notionDB/builder/notionRequestBuilder";

const notion = new Client({auth: process.env.NOTION_API_KEY});
const fetchUrlQuery = {
    database_id: process.env.NOTION_PULLS_DATABASE_ID,
    page_size: 100,
    filter: {
        or: [{
            property: process.env.NOTION_MERGED_AT_KEY,
            date: {past_week: {}}
        }],
    }
}

export const createNotionDatabaseItem = async (pull, notionUserList) => {
    const builder = new NotionRequestBuilder(pull, notionUserList);
    const requestBody = builder.createRequestBody();

    try {
        await notion.pages.create(requestBody);
        console.log('[SUCCESS] created notion database item');
    } catch (e) {
        console.error('NotionDB ERROR: ', e);
        throw e;
    }
}

export const fetchUrlsInAWeek = async (): Promise<string[]> => {
    let end = false;
    const firstResponse = await notion.databases.query(fetchUrlQuery);
    let allResults = firstResponse.results.map(r => {
        return r.properties[process.env.NOTION_URL_KEY].url
    });

    if (!firstResponse.has_more) {
        return allResults;
    }

    let startCursor = firstResponse.next_cursor;
    while (!end) {
        try {
            const response = await notion.databases.query({...fetchUrlQuery, start_cursor: startCursor});
            const result = response.results.map(r => {
                return r.properties[process.env.NOTION_URL_KEY].url
            });
            allResults = allResults.concat(result);

            if (!response.has_more) {
                end = true;
                continue;
            }

            startCursor = response.next_cursor;
        } catch (error) {
            end = true;
        }
    }

    return allResults;
}

export const fetchNotionUserList = async (): Promise<User[]> => {
    try {
        const response: QueryDatabaseResponse = await notion.databases.query({database_id: process.env.NOTION_USER_DATABASE_ID});

        return response.results.map(r => {
            const githubUser = r.properties['githubUserName'].rich_text.reduce((p, c) => p + c.text.content, "");
            const notionUser = r.properties['notionUser'].people;

            return {githubUser, notionUser}
        });
    } catch (error) {
        console.error('Notion User List ERROR:', error);
    }
}
