const controller = require("../controllers/controller.mobile_units");

module.exports = async function (fastify) {
  // Por id del registro 
  fastify.get("/id/:id", controller.getById);

  // Todos
  fastify.get("/", controller.getAll(''));
  // Total de todos
  fastify.get("/total", controller.countAll(''));
  // Total de todos por mes (1-12)
  fastify.get("/total/month/:month/year/:year", controller.countAll('WHERE extract(month FROM created_on) = $1 AND extract(year FROM created_on) = $2'));

  // Todos los logrados
  fastify.get("/achieved", controller.getAll('WHERE status_id = 1'));
  // Todos de un usuario especifico
  fastify.get("/achieved/user/:id", controller.getByUser('AND status_id = 1'));
  // Total de todos los logrados 
  fastify.get("/achieved/total", controller.countAll('WHERE status_id = 1'));
  // Total de todos los logrados por mes (1-12)
  fastify.get("/achieved/total/month/:month/year/:year", controller.countAll('WHERE status_id = 1 AND extract(month FROM created_on) = $1 AND extract(year FROM created_on) = $2'));

  // Todos los agendados
  fastify.get("/scheduled", controller.getAll('WHERE status_id = 2'));
  // Todos de un usuario especifico
  fastify.get("/scheduled/user/:id", controller.getByUser('AND status_id = 2'));
  // Total de todos los agendados 
  fastify.get("/scheduled/total", controller.countAll('WHERE status_id = 2'));
  // Total de todos los agendados por mes (1-12)
  fastify.get("/scheduled/total/month/:month/year/:year", controller.countAll('WHERE status_id = 2 AND extract(month FROM created_on) = $1 AND extract(year FROM created_on) = $2'));
  
  // Todos los no logrados
  fastify.get("/unachieved", controller.getAll('WHERE status_id = 3'));
  // Todos de un usuario especifico
  fastify.get("/unachieved/user/:id", controller.getByUser('AND status_id = 3'));
  // Total de todos los no logrados 
  fastify.get("/unachieved/total", controller.countAll('WHERE status_id = 3'));
  // Total de todos los no logrados por mes (1-12)
  fastify.get("/unachieved/total/month/:month/year/:year", controller.countAll('WHERE status_id = 3 AND extract(month FROM created_on) = $1'));
  
  // Todos de un usuario especifico
  fastify.get("/user/:id", controller.getByUser(''));

  // Detalles de unidad movil
  fastify.get("/details/:id", controller.getDetailsById);

  // Estadistica por año dividido en meses
  fastify.get("/statistics/annual/:year",controller.getStatisticsAnnual); //example 2024

  // Insertar unidad movil
  fastify.post("/", controller.insert);
  
  // Insertar especificaciones de unidad movil
  fastify.post("/details", controller.insertDetails);
}
