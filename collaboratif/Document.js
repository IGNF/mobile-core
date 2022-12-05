import CordovApp from '../CordovApp';
import ApiClient from 'collaboratif-client-api';

/**
 * Telechargement d un document
 * @param {String} url 
 * @param {String} name 
 * @param {function} success 
 * @param {function} fail 
 * @return void
 */
function downloadDocument(url, name, success, fail) {
    var dir = CordovApp.File.getDir(name);
    var name = CordovApp.File.getFileName(name);
    CordovApp.File.getDirectory(
        dir,
        function(fileEntry) {
            var uri = encodeURI(url);
            let client = new ApiClient();
            client.getDocument(uri).then((response) => {
                let blob = new Blob([JSON.stringify(response.data)]);
                if (blob) {
                    let url =  window.URL.createObjectURL(blob);
                    CordovApp.File.moveFile(url, fileEntry.toURL()+name, success, fail);
                }
            }).catch((error) => {
                fail(error);
            });
        }
    )
}

export default downloadDocument;