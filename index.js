const fs = require('fs')
const fastify = require('fastify')({logger: false})
const cors = require('@fastify/cors')

// require('dotenv').config()

process.loadEnvFile()

fastify.register(cors, {
  origin: '*'
})

// Obtiene la dirección de la carpeta de rutas
const pathRouter = `${__dirname}/routes`

// Genera automaticamente los prefijos para las rutas

fs.readdirSync(pathRouter).filter((file)=>{
    const route = file.substring(0, file.length - 3)
    fastify.register(require(`./routes/${route}.js`), { prefix: route })    
    // console.log('--->',route)
})

// Nombre de las rutas
// const routeName = ['archievement','user','worker','location','auth','schedule']

// routeName.forEach((route) => {
//   fastify.register(require(`./routes/route.${route}.js`), { prefix: `${route}` })
// })

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

const {
  PORT = 4000,
  HOST = '0.0.0.0'
} = process.env

const start = async () => {
    const port = PORT ;
    const host = HOST ;
    try {
      // Start the server on port 3000, listening on all network interfaces
      await fastify.listen({ port, host });
      // Log a message to indicate that the API is online
      console.log(`API running on the port ${port} and host ${host}`);
    } catch (err) {
      // Log any error that occurs during server startup and exit the process
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
start()