//importando biblioteca para gerar código uuid
const { v4: uuidv4 } = require('uuid');
var User = require("./User");
var Knex = require("../database/connection");
var User = require('./User');
const { json } = require('body-parser');

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

}

module.exports = new PasswordToken();