//importando biblioteca para gerar código uuid
const { v4: uuidv4 } = require('uuid');
var User = require("./User");
var Knex = require("../database/connection");
//const { json } = require('body-parser');
//const { update } = require('../database/connection');

class PasswordToken{

    async codeUuid(){
        var token = uuidv4();
        return token;
    }

    async create(email){
        const user = await User.findByEmail(email);

        if(user!=undefined){
            try {
               
                var token = await this.codeUuid();
               
                await Knex.insert({
                    tokens: token,
                    user_id: user.id,                     
                    used: 0
                 }).table("passwordtokens");    
                return {status: true, token: token};

            } catch (error) {
                return {status: false, err:"Erro no Knex create :"+error};
            }
            
        }else{
            return {err: "Erro: Verifique o email informado"};
        }
    }

    async validate(token){
        
        try {
            var userToken = await Knex.select().from('passwordtokens').where({tokens: token});

            if(userToken.length > 0){
                
                var tk = userToken[0];

                 if(tk.used == 1){
                    return {status: false, err: "Token já utilizado"}
                 }else{
                     return {status: true, user: userToken[0]};
                 }
            }else{
                return {status: false, err: "Token não existe"}
            }
        } catch (error) {
            return {status: false, err: "Erro knex validade: "+ error};
        }
         
    }

    async updateStatusToken(userToken){
        
        try {

            var tk = userToken;

            await Knex.update({used: 1}).from('passwordtokens').where({id: tk.id});                    
            return {status: true};
            
        } catch (error) {
            return {status: false, err:"updateStatusToken  - "+ error};
        }
    } 

}

module.exports = new PasswordToken();