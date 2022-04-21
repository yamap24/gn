# gn
gn is a tool to generate Notion database items from GitHub Pull Requests.

## Setup
### 1. Get GitHub Credentials
### 2. Integrate Notion app on your Notion
### 3. Set your credentials

> CAUTION: This process is only need if you execute on your local environment.

Create `.env` file and write your credentials and settings for Notion and GitHub.
```dotenv
# your notion database property names
GITHUB_TOKEN=YOURS
GITHUB_OWNER=YOURS
GITHUB_REPO=YOURS

# your notion database property names
NOTION_API_KEY=YOURS
NOTION_PULLS_DATABASE_ID=YOURS
NOTION_USER_DATABASE_ID=YOURS

# your notion database property names
NOTION_TILE_KEY=YOURS
NOTION_CATEGORY_KEY=YOURS
NOTION_ASSIGNEE_KEY=YOURS
NOTION_MERGED_AT_KEY=YOURS
NOTION_URL_KEY=YOURS
```


## Installation / deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: 
> - NodeJS (v.14.15.0 ~)
> - Serverless (v.3.0.0 ~ )

### Using NPM
```shell
# installation
> npm i

# execution on your local environment
> npx sls invoke local --function pull2NotionDB

# deploy this stack to AWS Lambda
> npx sls deploy
```

### Using Yarn
```shell
# installation
> yarn

# execution on your local environment
> yarn sls invoke local --function pull2NotionDB

# deploy this stack to AWS Lambda
> yarn sls deploy
```

## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── pull-notionDB
│   │   │   ├── api             #  api call source code
│   │   │   ├── builder         #  api request builder source code
│   │   │   ├── types           #  types
│   │   │   ├── handler.ts      #  lambda source code
│   │   │   └── index.ts        #  lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
└── tsconfig.paths.json         # Typescript paths
```