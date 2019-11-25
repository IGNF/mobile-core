# TODO

## Préparer l'abandon de UIebView sur iOS

* [PR: Remove all UIWebView code](https://github.com/apache/cordova-ios/issues/661)
* Utiliser [WKWebView](https://github.com/apache/cordova-plugin-wkwebview-engine)
* [Move from UIwebview to WKwebview](https://ionicframework.com/docs/v3/wkwebview/)
* Passer le localstorage iOS sur un système de fichier (pour ne pas perdre lors de la migration)
* Vérifier que les services définissent les CORS UIWebView never enforced CORS, but WKWebView does.

