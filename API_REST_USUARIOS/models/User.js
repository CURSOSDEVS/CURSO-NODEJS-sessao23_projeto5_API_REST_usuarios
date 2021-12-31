var Knex = require("../database/connection");

class User {

    async new(email,name,password){
        try {
            await Knex.insert({email,name,password,role: 0}).table('users')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new User();