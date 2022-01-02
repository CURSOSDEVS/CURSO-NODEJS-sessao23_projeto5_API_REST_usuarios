var Knex = require("../database/connection");
var bcrypt = require("bcrypt");
const knex = require("../database/connection");

class User {

    async new(email,name,password){
        try {
            var hash = await bcrypt.hash(password,10);

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
            var results = await Knex.select(["id","name","email","role"]).from("users").where({id: id});

            //tratando o retorno
            if(results.length > 0){
                return results[0];
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

}

module.exports = new User();