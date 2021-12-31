var User = require("../models/User");

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

        }else if( name == undefined || name == " " || name == ""){

            res.status(400);
            res.json({err: "O nome é inválido"});
            return;

        }else{
            try {

                var emailExists = await User.findEmail(email);

                if(emailExists){
                    res.status(406);
                    res.json({err: "O email já está cadastrado!"});
                    return;
                }

                await User.new(email,name,password);

                res.status(200);
                // console.log(req.body);
                 res.send("Tudo OK!");

            } catch (error) {
                console.log(error);
            }       
        }   
    }
}

module.exports = new UserController();