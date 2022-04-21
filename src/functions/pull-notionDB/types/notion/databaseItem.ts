import {CreatePageParameters} from "@notionhq/client/build/src/api-endpoints";

declare type WithAuth<P> = P & {
    auth?: string;
};

export type DatabaseItem = WithAuth<CreatePageParameters>