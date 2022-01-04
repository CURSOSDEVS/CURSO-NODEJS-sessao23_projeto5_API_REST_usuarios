var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");

class UserController{

    async index(req,res){

        var users = await User.findAll();
        res.json(users);

    }

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

        }else if( password == undefined || password == " " || password == ""){
            res.status(400);
            res.json({err: "A senha é obrigatória"});
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

    async findUser(req, res){

        //id está sendo passado na requisição pelo usuário
        var id = req.params.id;

        //verifica se o id passado é um número
        if(isNaN(id) || id == " "){
            res.status(406);
            res.json({err:"Id não definido !"});
            return;
        }else{

            var userId = await User.findById(id);
            
            //testando a geração do código uuid
            //var cod = await PasswordToken.codeUuid();

            if(userId == undefined){
                res.status(404);
                res.json({err: "Usuário não localizado !"});
            }else{
            res.status(200);
           // res.json({user: userId, uuid: cod});
            res.json({user: userId});
            }
        }

    }

    async edit(req, res){
        var {id, name, email, role} = req.body;

        var result = await User.update(id,name,email,role);

        if(result != undefined){
            if(result.status == true){
                res.status(200);
                res.send("Usuário atualizado!");
            }else{
                res.status(400);
                res.send(result.err)
            }

        }else{
            res.status(400);
            res.send(result.err)
        }
            
    }

    async remove(req, res){
        
        var id = req.params.id;

        var result = await User.delete(id);

        if(result==true){
            res.status(200);
            res.send("Usuário deletado");
        }else{
            res.status(406);
            res.send(result.err);
        }
        
    }

    async recoverPassword(req, res){
        var email = req.body.email;

        var results = await PasswordToken.create(email);

        if(results.status){
            //será enviado o email aqui
            res.status(200);
            res.send({msg:"Link para alteração de senha enviado para o email informado"});
        }else{
            res.status(406);
            res.send({erro: "Erro no recoverPassword: " + results.err});
        }

    }
}

module.exports = new UserController();