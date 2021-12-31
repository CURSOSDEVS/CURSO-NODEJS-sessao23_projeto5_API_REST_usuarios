
class UserController{

    async index(req, res){}

    async create(req, res){
        //fazendo um destruct para capturar os dados enviados na requisição
        var{email, name, password} = req.body;
        //validações dos campos
        if(email == undefined || email == ""){
            res.status(400);
            res.json({err:"O email é inválido"});
        }else{
            res.status(200);
            res.send("Tudo Ok!")
        }   
    }
}

module.exports = new UserController();