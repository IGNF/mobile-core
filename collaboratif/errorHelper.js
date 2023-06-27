/**
 * l'erreur axios n'est pas facile a decoder
 * permet de retourner un message (en francais si possible)
 * et un code dans un objet ex: {message: bla, code: 400}
 * @param {AxiosError} error 
 */
export function prettifyAxiosError(error) {
    let msg = "Une erreur inattendue s'est produite";
    let code = 500;
    if (error.code == "ERR_NETWORK") {
        msg = "Le réseau est indisponible";
    } else if (error.response && error.response.data) {
        msg = error.response.data.message ? error.response.data.message : error.response.data;
        code = error.response.data.code;
    } else if (error.response) {
        msg = error.response.statusText;
        code = error.response.status;
        if (code == 401) {
            msg = "Accès interdit, vous n'êtes peut être pas connectés"
        } else if (code == 403) {
            msg = "Autorisations insuffisantes";
        } else if (code == 500) {
            msg = "Une erreur inattendue s'est produite";
        }
    }
    return {"code": code, "message": msg};
}