// import { IClient, Feed, Item } from "./IClient";
import { IClient } from "./IClient";
import { ApiClient } from "./ApiClient";
import { GithubConstants } from "../Shared/Constants";

export class GithubClient extends ApiClient implements IClient {

    public getFeed(callback: any, errorCallback?: any) {
        this.performXhrRequest("GET", GithubConstants.Feed, (response: any) => {
            callback(response);
        }, [], errorCallback);
    }

    public discoverRepositories(callback: any, errorCallback?: any) {
        this.performXhrRequest("GET", GithubConstants.Discover, (response: any) => {
            callback(response);
        }, [], errorCallback);
    }

    public isLoggedIn(callback: (xhr: XMLHttpRequest) => void, errorCallback: (xhr: XMLHttpRequest) => void) {
        this.performXhrRequest("GET", GithubConstants.IsLoggedIn, callback, [], errorCallback);
    }
}