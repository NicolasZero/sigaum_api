const controller = require("../controllers/controller.schedule");

module.exports = async function (fastify) {
  // Todos los previamente agendados
  fastify.get("/", controller.getAllPreviously);
  // Total de todos los previamente agendados
  fastify.get("/Previously/total", controller.countAllPreviously);
  // Todos los previamente agendados por mes (1 a 12) y año (ejm: 2025)
  fastify.get("/Previously/total/month/:month/year/:year", controller.countAllPreviouslyForMonth());

  // Todos los agendados
  fastify.get("/all", controller.getAllScheduled);
  // Total de todos los agendados
  fastify.get("/all/total", controller.countAll);
  // Todos los agendados por mes (1 a 12) y año (ejm: 2025)
  fastify.get("/all/total/month/:month/year/:year", controller.countAllForMonth);

  // Agendado por id
  fastify.get("/id/:id", controller.getScheduledById);

  // Todos los agendados por un usuario
  fastify.get("/user/:id", controller.getAllScheduledbyUser);

  // Actualizar
  fastify.put("/", controller.updateScheduled);
}
