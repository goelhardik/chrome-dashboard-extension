export class ApiClient {

    public performXhrRequest(method: string, url: string, callback: any, headers: [string, string][]) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function (event) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // Callback with the data (incl. tokens).
                    callback(xhr.responseText);
                }
            }
        });
        xhr.open(method, url, true);
        headers.forEach(header => {
            xhr.setRequestHeader(header[0], header[1]);
        });
        xhr.send();
    }
}