const controller = require("../controllers/controller.age_range");

module.exports = async function (fastify) {
    fastify.get("/", controller.getAll)
}
