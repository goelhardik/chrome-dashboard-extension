export class Item {
    title: string;
    description: string;
    thumbnail: string;
    url?: string;
}

export class Feed {
    items: Item[];
}

export interface IClient {
    getFeed(callback: any, authorizationToken? : string, errorCallback?: any): void;
}