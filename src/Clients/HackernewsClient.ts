import { IClient, Feed, Item } from "./IClient";
import { ApiClient } from "./ApiClient";

export class HackernewsClient extends ApiClient implements IClient {
    getFeed(callback: any) {
        let feed = new Feed();
        feed.items = new Array<Item>();
        
        this.performXhrRequest("GET", "https://hacker-news.firebaseio.com/v0/topstories.json", (response: any) => {
            response = JSON.parse(response).slice(0, 15);
            for (let id of response) {
                this.performXhrRequest("GET", `https://hacker-news.firebaseio.com/v0/item/${id}.json`, (story: any) => {
                    let parsedStory = JSON.parse(story);
                    let elt = new Item();
                    elt.title = parsedStory.title;
                    elt.url = parsedStory.url;
                    feed.items.push(elt);
                    if(feed.items.length === 10) callback(feed);
                }, []);
            }

        }, []);
    }
}