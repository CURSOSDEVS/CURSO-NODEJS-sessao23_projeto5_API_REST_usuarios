var Knex = require("../database/connection");
var bcrypt = require("bcrypt");
const knex = require("../database/connection");
var PasswordToken = require("./PasswordToken");


class User {

    async hashPassword(password){
        try {
            var cryptPassord = await bcrypt.hash(password,10);
            return {status: true, password: cryptPassord};
        } catch (error) {
            return {status: false, err:"hasPassword: "+ error};
        }
    }

    async new(email,name,password){
        try {

            //var hash = await bcrypt.hash(password,10);
            var hash = await this.hashPassword(password);

            await Knex.insert({email, name, password: hash, role: 0}).table('users');

        } catch (error) {
            console.log(error);
        }
    }

    async findEmail(email){
        try {

            var result = await knex.select("*").from("users").where({email: email});

            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        } catch (error) {
            console.log(error);
            return false;
        }  
    }

    async findAll(){

        try {
            var results = await knex.select(["id","email","name","role"]).from("users");
            return results;
        } catch (error) {
            console.log(error)
            return [];
        }
       
    }

    async findById(id){
        try {
            var user = await Knex.select(["id","name","email","role"]).from("users").where({id: id});

            //tratando o retorno
            if(user.length > 0){
                return  {status:true, user: user[0]};
            }else{
                return undefined;
            }
            
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
    
    async update(id,name,email,role){

            var user = await this.findById(id);  
            
            //verificando o resultado  
            if(user != undefined){  

                var editUser = {};

                if(email != undefined){

                    if(email != user.email){

                        var result = await this.findEmail(email);

                        if(result == false){
                            editUser.email = email;
                        }else{
                            console.log("O email já existe")
                            return {status: false, err: "e-mail já está cadastrado! "};                       
                        }
                    }else{
                        console.log("O email já existe")
                            return {status: false, err: "e-mail já está cadastrado! "};  
                    }
                }

                if(name != undefined){
                    editUser.name = name;
                }

                if(role != undefined){
                    editUser.role = role;
                }

                try {
                    await Knex.update(editUser).from("users").where({id: id});    
                    return {status: true};
                } catch (error) {
                    return {status: false, err: error}
                }

            }else{
                return {status: false, err:"Usuário não existe !"};
            }
    }

    async delete(id){

        var result = await this.findById(id);

        if(result != undefined){
            try {
                await knex.delete().from("users").where({id: id});
                return {status: true, err:"Usuário deletado"};
            } catch (error) {
                return {status: false, err: "Erro ao deletar usuário"};
            }
        }else{
            return {status: false, err:"Usuário não existe"};
        }

    }

    async findByEmail(email){
        try {

            var user = await Knex.select(["id","name","email","role"]).from("users").where({email: email});
           
            if(user.length >= 0){
                return user[0];
            }else{
                return {status: false, err:"Verifique o email informado"};
            }
        } catch (error) {
            return{status: false, err:"Erro no Knex findbyemail: "+error};
        }
    }

    async updatePassword(token,newPassword){
        
        var validToken;

        try {
            //verificando se o token é válido
            validToken = await PasswordToken.validate(token);
            
            if(validToken.status){

                //passando o usuário para acessarmos o atributo user_id
                var tokenUser = validToken.user;

                //criptografando a nova senha do usuário
                var cryptPassword = await this.hashPassword(newPassword);

                await Knex.update({password: cryptPassword.password}).from('users').where({id: tokenUser.id});
                await PasswordToken.updateStatusToken(validToken.user);
                
                return {status: true};

            }else{
                return {status: false, err: validToken.err};
            }
        
        } catch (error) {
            return {status: false, err:"updatePassword: "+ error};
        }

    }
}

module.exports = new User();