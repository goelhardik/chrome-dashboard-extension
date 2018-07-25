export class Item {
    title: string;
    description: string;
    thumbnail: string;
}

export class Feed {
    items: Item[];
}

export interface IClient {
    getFeed(callback: any, authorizationToken? : string, errorCallback?: any): void;
}