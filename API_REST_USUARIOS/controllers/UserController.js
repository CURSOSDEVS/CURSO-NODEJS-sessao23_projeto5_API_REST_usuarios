
class UserController{

    async index(req,res){}

    async create(req, res){
        //console.log(req.body);
        //res.send("Pegando o corpo da requisição");

         var {email, name, password} = req.body;

       if(email == undefined || email == "" || email == " "){
            res.status(400);
            res.json({err: "O email é inválido"});
            return;
        }

        res.status(200);
        console.log(req.body);
        res.send("Tudo OK!"); 

        

        
    }

}

module.exports = new UserController();