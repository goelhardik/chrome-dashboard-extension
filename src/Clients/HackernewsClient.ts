import { IClient, Feed } from "./IClient";
import { ApiClient } from "./ApiClient";

export class HackernewsClient extends ApiClient implements IClient {
    getFeed(): Promise<Feed> {
        throw new Error("Method not implemented.");
    }
}