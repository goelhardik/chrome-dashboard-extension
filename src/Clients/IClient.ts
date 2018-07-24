export class Item {
    key: string;
    title: string;
    description: string;
}

export class Feed {
    items: Item[];
}

export interface IClient {
    getFeed(callback: any): void;
}