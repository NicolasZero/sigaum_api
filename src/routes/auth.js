const controller = require("../controllers/controller.auth");

module.exports = async function (fastify) {
    fastify.post("/", controller.auth)    
}
