const controller = require("../controllers/controller.location");

module.exports = async function (fastify) {
    fastify.get("/state", controller.statesAll)
    fastify.get("/state/:id", controller.statesAll)

    fastify.get("/municipality", controller.municipalitiesAll)
    fastify.get("/municipality/state/:id", controller.municipalityBy)

    fastify.get("/parish", controller.parishAll)
    fastify.get("/parish/municipality/:id", controller.parishBy)
}
