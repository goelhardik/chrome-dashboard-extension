import { IClient, Feed, Item } from "./IClient";
import { ApiClient } from "./ApiClient";
import { AuthorizationConstants } from "../AccessTokenRetriever";

export class GithubClient extends ApiClient implements IClient {

    public getFeed(callback: any, accessToken?: any, errorCallback?: any) {
        // tslint:disable-next-line:no-console
        if(accessToken) {
            console.log("calling with access token: " + accessToken);
            console.log("accesstoken is: " + accessToken[AuthorizationConstants.github.storageKey]);
        }
        this.performXhrRequest("GET", "https://api.github.com/user", (response: any) => {
            response = JSON.parse(response);
            this.performXhrRequest("GET", 
            "https://api.github.com/users/" + response["login"] + "/received_events", 
            (innerResponse: any) => {
                this.onFeedsReceived(innerResponse, callback);
            }, [["Authorization", "token " + accessToken]], errorCallback)
        }, [["Authorization", "token " + accessToken]], errorCallback);
    }

    private onFeedsReceived = (innerResponse: any, callback: any) => {
        const listItems = JSON.parse(innerResponse);
        let feed = new Feed();
        feed.items = new Array<Item>();
        (listItems as any[]).forEach(item => {
            console.log(item);
            const thumbnail = item["actor"]["avatar_url"];
            feed.items.push({
                thumbnail : thumbnail,
                title: item["actor"]["display_login"],
                description: ""
            })
        });
        callback(feed);
    }
}