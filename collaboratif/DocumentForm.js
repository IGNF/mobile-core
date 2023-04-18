import CordovApp from '../CordovApp';
import ol_Feature from 'ol/Feature';

/**
 * gestion des attributs documents dans les formulaires du collaboratif 
 */
class DocumentForm {
    constructor (wapp) {
        this.wapp = wapp;

        let apiUrl = wapp.userManager.getServiceUrl();
        let baseUrl =  apiUrl.replace("gcms/api", "");
        this.getUrl = baseUrl + 'document/image/__ID__';
    }

    init() {
        var self = this;
        $('.feature-form tr[data-type="document"]').each(function(){
            var current = $(this);
            self.updateLink(current);
            self.addButtons(current);
        });
    }

    /**
     * Ajout des boutons d'ajout/modif d'une image et de suppression
     * @param {JQuery} $e element td genere par DocumentAttribute de collab-form 
     */
    addButtons($e) {
        var self = this;
        let $a = $e.find('a');
        let delButton = $('<button class="doc-btn fa fa-trash"></button>');
        let folderButton = $('<button class="doc-btn fa fa-folder-open"></button>');
    
        folderButton.on("click", () => {
        wapp.getPicture(
            function(url) {
            if (url) {
                $a.attr('data-docid', CordovApp.File.getFileURI(url)+'?'+new Date().getTime());
                self.updateLink($e);
            }
            },
            null,
            {
            prompt: 'Ajouter une photo',
            name: 'TMP/photo.jpg',
            buttons: { photo:'Caméra', album:'Album', cancel:'annuler' },
            className: 'form photo'
            }
        );
        });
        delButton.on("click", () => {
        $a.attr('data-docid', "");
        self.updateLink($e);
        })
        $a.after(delButton);
        $a.after(folderButton);
    }

    /**
     * Mise a jour de la balise src de l image par rapport au champs data-docid de <a> pour voir apparaitre les images
     * @param {JQuery} $e element td genere par DocumentAttribute de collab-form 
     */
    updateLink($e) {
        let $a = $e.find('a');
        let id = $a.attr('data-docid');
        if (!id) {
          $a.attr('href', '');
          $a.html('');
          return;
        }
        let mimeTypes = $a.attr('mime-types');
        var link = id;
        if (parseInt(id) == id){
          link = this.getUrl.replace(/__ID__/g, id);
        }
        
        if (mimeTypes.indexOf("image") != -1) {
          
          $a.html('');
          $('<img>').attr('src', link).appendTo($a);
        } else {
          $a.html(id);
        }
    }
}

/**
 * Ajoute un document
 * @param {} apiClient
 * @param {Array} tableau des urls locales des documents
 */
var postDoc = async function(apiClient, localUrl) {
    return new Promise((resolve, reject) => {
        CordovApp.File.getBlob (
            localUrl,
            function(document) {
                let formData = new FormData();
                let mimeType = document.type;
                let extension = mimeType.split("/")[1];
                let name = 'document.' + extension;
                formData.append('file', document, name);
                apiClient.doRequest(
                    "/../../document/add", "post", formData, null, 'multipart/form-data'
                ).then((response) => {
                    return resolve(response.data.id);
                }).catch((e) => {
                    return reject(e);
                });
            },
            (e) => {return reject(e)}
        )
    });
}

export { DocumentForm, postDoc }