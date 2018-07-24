import { IClient, Feed, Item } from "./IClient";
import { ApiClient } from "./ApiClient";

export class GithubClient extends ApiClient implements IClient {

    getFeed(callback: any) {
        // tslint:disable-next-line:no-console
        this.performXhrRequest("GET", "https://api.github.com/user", (response: any) => {
            response = JSON.parse(response);
            this.performXhrRequest("GET", "https://api.github.com/users/" + response["login"] + "/received_events", (innerResponse: any) => {
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
            }, [["Authorization", "token e1f5742f697229d44d7546a7ff454b1e62ee0c62"]])
        }, [["Authorization", "token e1f5742f697229d44d7546a7ff454b1e62ee0c62"]]);
    }
}