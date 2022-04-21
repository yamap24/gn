import {fetchAllMergedPullsInAWeek} from "@functions/pull-notionDB/api/github";
import {fetchNotionUserList, createNotionDatabaseItem, fetchUrlsInAWeek} from "@functions/pull-notionDB/api/notion";

const generateReleaseNote = async (): Promise<void> => {
    const notionUserList = await fetchNotionUserList();
    let pulls = await fetchAllMergedPullsInAWeek();
    const alreadyAddedPulls = await fetchUrlsInAWeek();

    pulls.filter(p => !alreadyAddedPulls.includes(p.url))
        .forEach(p => createNotionDatabaseItem(p, notionUserList))
};


export const main = generateReleaseNote;