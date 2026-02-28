const controller = require("../controllers/controller.service_type");

module.exports = async function (fastify) {
    fastify.get("/", controller.getAll)
}
