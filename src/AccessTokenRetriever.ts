export const AuthorizationConstants = {
    github: {
        authorizationUrl: "https://github.com/login/oauth/authorize?client_id=",
        accessTokenUrl: "https://github.com/login/oauth/access_token",
        client_id: "2c4cb7fa5fff670e19d4",
        client_secret: "6f0b42dc52b0c1a25474b0731f50f7135f2bb58b",
        grant_type: 'authorization_code',
        storageKey: 'feeds_github_token'    
    },
    redirectUrlSegment: "feeds123"
}

export class AccessTokenRetriever {
    private onTokenRetrieved: (token: string) => void;

    constructor(onTokenRetrieved: (token: string) => void) {
        this.onTokenRetrieved = onTokenRetrieved;
    }

    public retrieveAccessToken = () => {
        var redirectUrl = this.getRedirectUrl();
        var authUrl = AuthorizationConstants.github.authorizationUrl
            + AuthorizationConstants.github.client_id
            + "&redirect_uri="
            + redirectUrl;
    
        var details = {
            url: authUrl,
            interactive: true
        }
    
        return chrome.identity.launchWebAuthFlow(details, this.useCode);
    }

    private useCode = (redirectUrl: any): void => {
        var authorizationCode = redirectUrl.match(/[&\?]code=([\w\/\-]+)/)[1];
        console.log(redirectUrl);
        console.log("found authorization code: " + authorizationCode);
        this.retrieveToken(authorizationCode, this.storeAccessToken);
    }

    private getRedirectUrl = (): string => {
        const redirectUrl =  chrome.identity.getRedirectURL(AuthorizationConstants.redirectUrlSegment);
        console.log(redirectUrl);
        return redirectUrl;
    }

    private retrieveToken = (authorizationCode: string, parseTokenCallback: any) => {
        var items = {
            code: authorizationCode,
            client_id: AuthorizationConstants.github.client_id,
            client_secret: AuthorizationConstants.github.client_secret,
            grant_type: AuthorizationConstants.github.grant_type
        }
        // tslint:disable-next-line:no-console
        console.log('access code ' + authorizationCode);
        var formData = new FormData();
        var key = null;
        for (key in items) {
            formData.append(key, items[key]);
        }
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function (event) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // Callback with the data (incl. tokens).
                    parseTokenCallback(xhr.responseText);
                }
            }
        });
    
        xhr.open('POST', AuthorizationConstants.github.accessTokenUrl, true);
        xhr.send(formData);
    }

    private storeAccessToken = (response: any) => {
        // tslint:disable-next-line:no-console
        console.log("Response received from access token " + response);
    const accessToken = response.match(/access_token=([\w\/\-]+)&*/)[1];
        console.log("access token is: " + accessToken);
        const storageObject = {};
        storageObject[AuthorizationConstants.github.storageKey] = accessToken;
        chrome.storage.sync.set(storageObject, () => {
            console.log("Set token value");
        });
        this.onTokenRetrieved(accessToken);
    }
}
