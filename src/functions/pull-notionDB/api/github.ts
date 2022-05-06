import {Octokit} from '@octokit/core';

const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});

export const fetchAllMergedPullsInAWeek = async (): Promise<PullRequest[]> => {
    let page = 1;
    let end = false;
    let allResults = [];

    while (!end) {
        try {
            const res = await fetchMergedPulls(page);

            if (res.length === 0) {
                end = true;
                continue;
            }

            allResults = allResults.concat(res);
            page++;
        } catch (error) {
            end = true;
        }
    }

    return allResults;
}

const fetchMergedPulls = async (page): Promise<Array<PullRequest>> => {
    return await octokit.request(`GET /repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/pulls`, {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        state: 'closed',
        sort: 'created',
        direction: 'desc',
        page: page,
        per_page: 50,
    }).then(results => results.data.filter(r => isOneWeekAgo(r.merged_at)).map(r => {
        return {
            title: r.title,
            url: r.html_url,
            description: r.body,
            labels: r.labels.map(l => l.description),
            mergedAt: r.merged_at,
            assignee: r.user.login,
        };
    })).catch(e => {
        console.error('Github Fetch Pull Error: ', e);
        throw e;
    });
}

const isOneWeekAgo = (date: string): boolean => {
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - process.env.GITHUB_PULL_SEARCH_SPAN);
    return Date.parse(date) >= oneWeekAgo.getTime();
}