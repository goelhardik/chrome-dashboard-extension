export class OAuth {

    public authorize(appCallback: any) {
        chrome.tabs.create({ url: "https://github.com/login/oauth/authorize?client_id=2fc1261e39a3d7717f28" });
    }
}
