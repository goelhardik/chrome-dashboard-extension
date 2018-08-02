export class ApiClient {

    public performXhrRequest(method: string, url: string, callback: any, headers: [string, string][], errorCallback?: any) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function (event) {
            console.log("SDFSDFSDFSDF " + xhr.response);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // Callback with the data (incl. tokens).
                    callback(xhr);
                } else {
                    if (errorCallback) {
                        errorCallback(xhr);
                    }
                }
            }
        });
        xhr.open(method, url, true);
        headers && headers.forEach(header => {
            xhr.setRequestHeader(header[0], header[1]);
        });
        xhr.send();
    }
}