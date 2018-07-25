// import { IClient, Feed, Item } from "./IClient";
import { IClient } from "./IClient";
import { ApiClient } from "./ApiClient";
import { AuthorizationConstants } from "../AccessTokenRetriever";

export class GithubClient extends ApiClient implements IClient {

    public getFeed(callback: any, accessToken?: any, errorCallback?: any) {
        // tslint:disable-next-line:no-console
        if (accessToken) {
            console.log("calling with access token: " + accessToken);
            console.log("accesstoken is: " + accessToken[AuthorizationConstants.github.storageKey]);
        }
        this.performXhrRequest("GET", "https://github.com/dashboard-feed", (response: any) => {
            callback(response);
        }, [["Authorization", "token " + accessToken]], errorCallback);
    }
}