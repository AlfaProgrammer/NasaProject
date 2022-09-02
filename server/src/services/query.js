// per fare le query paginate su qualsiasi endpoint

const DEFUALT_PAGE_LIMIT = 0; // se passo a mongoose un limite = 0 mi restituira tutti i record
const DEFAULT_PAGE_NUMBER = 1;
//

function getPagination(query){
    const limit = Math.abs(query.limit) || DEFUALT_PAGE_LIMIT;// ritorna il valore assoluto di un numero (converte in automatico stringa in numero)
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    // utilizzo questa strategia in caso non vengano inseriti query string dal client, così da avere un risultato di default
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}