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
}

module.exports = new User();