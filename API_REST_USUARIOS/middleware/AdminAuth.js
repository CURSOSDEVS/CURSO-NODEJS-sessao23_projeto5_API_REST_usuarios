var jwt = require('jsonwebtoken');
//chave de criptografia do token
var secret = "@@#$@¨5###@kdkdkaee)98&!111!!'!2233<.JH";

module.exports = function(req, res, next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const beared = authToken.split(' ');
        var token = beared[1];

        try {          
            var decoded = jwt.verify(token,secret);
            
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.send("Você não está autorizado");
                return;
            }          
        } catch (error) {
            res.status(401);
            res.send("Erro de autenticação, token inválido");
            return;
        }   
    }else{
        res.status(403);
        res.send("Você não está autenticado");
        return;
    }

}