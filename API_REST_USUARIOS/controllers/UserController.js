var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
//chave de criptografia do token
var secret = "@@#$@¨5###@kdkdkaee)98&!111!!'!2233<.JH";

const SMTP_CONFIG = require('../config/smtp');
const mailer = require("nodemailer");

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

    async changePassword(req, res){
        
        var {token, newPassword} = req.body;

        var result = await User.updatePassword(token,newPassword);

        if(result != undefined){
            if(result.status == true){
                res.status(200);
                res.send(result.err);
            }else{
                res.status(400);
                res.send(result.err)
            }

        }else{
            res.status(406);
            res.send(result.err)
        }
        

    }

    async login(req, res){

        var {email, password} = req.body;

        var user = await User.findByEmail(email);

        if(user != undefined){

            var isCorrectPassword = await User.comparePassword(password, user);

           // console.log("iscorretPassword:"+isCorrectPassword.status);
            
            if(isCorrectPassword.status){
                //GERANDO O TOKEN DE AUTENTICAÇÃO COM JWT

                var tokenJwt = jwt.sign({email: user.email, role: user.role}, secret);

                res.json({tokenJwt: tokenJwt});
                
                res.status(200);
                //res.send("Usuário Logado");
            }else{
                res.status(406);
                res.send({err: isCorrectPassword.err});
            }
            
        }else{
            res.status(404);
            res.send("Usuário não encontrado");
        }

    }

    async sendEmail(req, res){
        var { name, email, mensage } = req.body;
     
        
        let transporter = mailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

            transporter.sendMail({        
                from: 'Claudisnei <testdevclaudisnei@gmail.com>',
                to: email,
                subject: name+' Assundo do e-mail',
                text: mensage,
                html: "Olá eu acho o nodemail legal<a href=https://guiadoprogramador.com> Nodemailer</a>"
            }).then(message => {
                transporter.close();
                res.send(message);
                console.log(message);
            }).catch(err => {
                transporter.close();
                res.send(err);
                console.log(err);
            });
        
        
    }
}
module.exports = new UserController();