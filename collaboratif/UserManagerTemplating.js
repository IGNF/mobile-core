import UserManager from "cordovapp/collaboratif/UserManager";
import CordovApp from '../CordovApp';
import { wappStorage } from '../cordovapp/CordovApp';
import {dialog, waitDlg, messageDlg} from '../cordovapp/dialog';
import {Report} from '../report/ReportForm';
import { editionCacheDir } from "cordovapp/ol/source/CollabVector";

/**
 * surcouche de userManager avec des elements de template
 * pour avertissement a la deconnexion on admet qu un compteur d actions actions-count existe dans la div id=map,
 * et un compteur de signalements local-count dans la div id=signalements
 */
class UserManagerTemplating extends UserManager {
    /*
     * @param options {Object}
     *      @param options {String} infoElement element pour l'info de connexion, ex: '#options .connect [data-input-role="info"] span.info'
     *
     */
    constructor(apiClient, options) {
        super(apiClient);
        this.infoElement = options.infoElement;
        this.initialize();
        $(() => {
            $(document).on("changegroup", (e) => {
                this.refreshGroupInfos(e.community);
            });
        });
    }

    /**
     * Met a jour les informations du groupe (logo et nom) dans l encadre dedie
     * @param {Community} community 
     */
    refreshGroupInfos(community = "") {
        var self = this;
        self.getLogo(community, function(logo) {
            // Show user info
            $("img.logo").attr("src", CordovApp.File.getFileURI(logo) || "img/ign.png");    
        }, this);

        var info = (community ? community.name+"<br/>": "")
        + (this.param.username || "Espace collaboratif");
        $(".userinfo").html(info);
    }

    /**
     * Initialization de l utilisateur s il existe
     * @return {voids}
     */
     initialize() {
        if (this.param.username && this.param.password) {
            if (this.param.userId) this.userId = this.param.userId;
            this.setUser(this.param.username, this.param.password, true);
        }
        var community = this.getGroupById(this.param.active_community);
        if (community) this.refreshGroupInfos(community);
    }

    /** 
     * Dialog de connexion a l'espace collaboratif
     * @param {Element} options.
     * @param {} options
     *	- onConnect {function} a function called when connected/deconnected
     *	- onShow {function} a function called when the dialog is shown
     *	- onQuit {function} a function called when the dialog is closed
     *	- onError {function} a function called when an error occures
     */
    connectDialog(options) {
        var self = this;
        options = options || {};
        var tp = CordovApp.template('dialog-connectreport');
        var nom = $(".nom",tp);
        var pwd = $(".pwd",tp);
        pwd.on("keyup", () => {
            pwd.removeClass("encrypted");
        });
        dialog.show ( tp, {
        title:"Connexion", 
            classe: "connect", 
            buttons: { cancel:"Annuler", deconnect: "Déconnexion", submit:"Connexion"},
            callback: function(bt) {
                if (bt == "submit") {
                    waitDlg("Connexion au serveur...");
                    let encrypted = pwd.hasClass("encrypted");
                    self.setUser (nom.val().trim(), pwd.val().trim(), encrypted);
                    self.checkUserInfo (
                        options.onConnect, 
                        (typeof (options.onError) == "function") ? options.onError : null,
                        function() { 
                            if (options.page) setTimeout(function(){ CordovApp.showPage(options.page); });
                            waitDlg(false); 
                        }
                    );
                } 
                else if (bt=="deconnect") {
                    let countRems = document.getElementById('signalements').getAttribute('local-count') || 0;
                    let countActions = document.getElementById('map').getAttribute('actions-count') || 0;
                    if (countRems || countActions) {
                        let mess = 'Vous avez ('+countRems+') signalements et ('+countActions+') actions en cours. Ils seront perdus si vous vous déconnectez. Continuer?'
                        messageDlg (mess,
                            "Attention", {
                              ok: "Continuer",
                              cancel: "Annuler"
                            },
                            function (b) {
                                if (b == 'ok') {
                                    self.disconnect();
                                    if (typeof (options.onConnect) == "function") options.onConnect({connected:false});
                                }
                            });
                    } else {
                        self.disconnect();
                        if (typeof (options.onConnect) == "function") options.onConnect({connected:false});
                    }
                }
                if (typeof (options.onQuit) == "function") options.onQuit({ dialog:tp, target: this });
            }
        });
        nom.focus().val(self.getUser());
        pwd.val(self.getPassword());
        if (typeof (options.onShow) == "function") options.onShow({ dialog:tp, target: this });
        self.saveParam();
    };

    /**
     * Changement d'utilisateur
     * @param {String} user user name
     * @param {String} password user pwd
     * @param {Boolean} encrypted true si le mot de passe est deja encrypte
     * 
     */
    setUser(user, password, encrypted = false) {
        super.setUser(user, password, encrypted);
        if (this.infoElement) {
            var self = this;
            $(() => {
                $(self.infoElement)
                    .html(self.param.username+" / &#x25cf;&#x25cf;&#x25cf;&#x25cf;&#x25cf;")
                    .parent().addClass("connected");
            });
        }
    }
    
    /**
     * Deconnexion 
     */
    disconnect() {
        super.disconnect();
        if (this.infoElement) $(this.infoElement).parent().removeClass("connected");
        
        $("img.logo").attr("src","img/ign.png");
        $(".userinfo").html("Espace collaboratif");

        // Clear credentials
        var win;
        if (window.cordova) {
            if (cordova.InAppBrowser) {
            win = cordova.InAppBrowser.open('logout.html','_blank','clearsessioncache=yes,hidden=yes');
            } else {
            console.warn('InAppBrowser plugin is missing...');
            }
        } else {
            win = window.open('logout.html','_blank','clearsessioncache=yes,hidden=yes');
        }
        if (win) setTimeout(function(){ win.close(); }, 100);
    }
    
    /** 
     * Recupere le logo d'un goupe
     * @param {any} g le groupe
     * @param {function} cback callback fonction qui renvoie le nom du fichier
     */
    getLogo(g, cback, scope) {
        CordovApp.File.getFile (
            "TMP/logo/"+(g ? g.id : '_nologo_'),
            function(fileEntry) {
                cback.call(scope, CordovApp.File.getFileURI(fileEntry.toURL()));
            },
            function() {
                cback.call(scope, g ? g.logo : null);
            }
        );
    };
}



export default UserManagerTemplating;