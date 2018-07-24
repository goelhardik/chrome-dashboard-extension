import { IClient } from "./IClient";
import { ApiClient } from "./ApiClient";

export class GithubClient extends ApiClient implements IClient {

    getFeed(callback: any) {
        // tslint:disable-next-line:no-console
        this.performXhrRequest("GET", "https://api.github.com/user", (response: any) => {
            response = JSON.parse(response);
            this.performXhrRequest("GET", "https://api.github.com/users/" + response["login"] + "/received_events", (innerResponse: any) => {
                console.log(innerResponse);
                callback(innerResponse);
            }, [["Authorization", "token e1f5742f697229d44d7546a7ff454b1e62ee0c62"]])
        }, [["Authorization", "token e1f5742f697229d44d7546a7ff454b1e62ee0c62"]]);
    }
}