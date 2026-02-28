const controller = require("../controllers/controller.service_subtype");

module.exports = async function (fastify) {
    fastify.get("/", controller.getAll)
}
