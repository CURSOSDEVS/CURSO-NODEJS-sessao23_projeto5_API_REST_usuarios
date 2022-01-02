var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");

//rota para acessar a home da página
router.get('/', HomeController.index);

//rota para criar um novo usuário
router.post('/user', UserController.create);

//rota para listar todos os usuário em json
router.get('/user', UserController.index);

//rota para buscar um usuário pelo id passado como parâmetro na rota
router.get('/user/:id', UserController.findUser);

//rota para alterar um usuário
router.put('/user', UserController.edit);

//rota para deletar um usuário
router.delete("/user/:id", UserController.remove);


module.exports = router;