const controller = require("../controllers/controller.archievement");

module.exports = async function (fastify) {
  // Todos los logrados
  fastify.get("/", controller.getAll);
  
  // Total de todos los logrados
  fastify.get("/total", controller.countAll);
  
  // Total de todos los logrados
  fastify.get("/total/month/:month/year/:year", controller.countAllForMonth);
  
  // Logrado por id
  fastify.get("/id/:id", controller.getById);
  
  // los logrados de un usuario
  fastify.get("/user/:id", controller.getAllByUser);
  
  // Estadistica
  fastify.get("/statistics/annual",controller.getStatisticsAnnual(false)); // NT: para la grafica de barras
  fastify.get("/statistics/annual/year/:year",controller.getStatisticsAnnual(true)); // NT: para la grafica de barras
  
  fastify.get("/statistics/activity",controller.getStatisticsActivity(false)); // NT: para la grafica de pastel
  fastify.get("/statistics/activity/year/:year",controller.getStatisticsActivity(true)); // NT: para la grafica de pastel
  
  fastify.get("/statistics/table_annual",controller.getTableForYear(false)); //acumulativo de todos los años
  fastify.get("/statistics/table_annual/year/:year",controller.getTableForYear(true)); // acumulativo de un año especifico
  
  fastify.get("/statistics/table_activity",controller.getTableForActivity(false));
  fastify.get("/statistics/table_activity/year/:year",controller.getTableForActivity(true));

  fastify.get("/statistics/table_state",controller.getTableForState(false));
  fastify.get("/statistics/table_state/year/:year",controller.getTableForState(true));

  fastify.get("/statistics/table_gender",controller.getTableForGender(false));
  fastify.get("/statistics/table_gender/year/:year",controller.getTableForGender(true));
  
  // insertar logros o agendar
  fastify.post("/", controller.insert);
}
