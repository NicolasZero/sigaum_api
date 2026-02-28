const controller = require("../controllers/controller.worker");

module.exports = async function (fastify) {
    fastify.get("/", controller.getAllWorker)
    fastify.get("/id/:id", controller.getWorkerById)
    fastify.get("/ic/:ic", controller.getWorkerByIc)
    fastify.post("/", controller.setWorker)
    fastify.put("/", controller.updateWorker)
}
