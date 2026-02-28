const { query } = require("../db/postgresql");
const { encrypt, compare } = require("../helpers/helperEncrypt.js");

const getAllUser = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.view_users;`
        const resp = await query(textQuery)
        return reply.send({status: "ok", msg:`Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getUserById = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT * FROM regions.view_users WHERE id = $1;`
        const resp = await query(textQuery,[id])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const updatetUser = async (request, reply) => {
    try {
        // if (!request.body) {
        //     return reply.code(400).send({ error: "body not valid", status: "failed" });
        // }

        // const {worker_id, username, password, role_id} = request.body

        // Request body verification
        // if (worker_id !== "number" || typeof role_id !== "number" || typeof username !== "string" || typeof password !== "string") {
        //     return reply.code(400).send({ error: "body not valid", status: "failed" })
        // }

        // const textQuery = `INSERT INTO regions.users (worker_id, username, password, role_id) VALUES ($1, $2, $3, $4);`
        // const resp = await query(textQuery,[worker_id, username, password, role_id])
        // return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
        return "En progreso"
    } catch (error) {
        console.log(error) ;
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const changeUserStatus = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body not valid", status: "failed" });
        }
        const {id,is_active} = request.body

        // Request body verification
        if (typeof id !== "number" || typeof is_active !== "boolean") {
            return reply.code(400).send({ error: "body not valid", status: "failed" })
        }
        
        const textQuery = `UPDATE regions.users SET is_active = $1 WHERE id = $2;`
        const resp = await query(textQuery,[is_active,id])
        
        // Comprueba si se actualizo con exito
        if (resp.rowCount == 0) {
            return reply.code(409).send({ error: "error en la petición", status: "failed" });
        }

        return reply.send({ status: "ok", msg: `Se actualizo con exito` });
    } catch (error) {
        console.log(error) ;
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const createUser = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body not valid, datos incompletos", status: "failed" });
        }
        const { worker_id, username, password, role_id } = request.body;

        // Request body verification
        if (typeof worker_id !== "number" || typeof username !== "string" || typeof password !== "string" || typeof role_id !== "number") {
            return reply.code(400).send({ error: "body not valid, error en tipo de dato", status: "failed" });
        }

        // Check if worker_id already has a user
        let textQuery = `SELECT * FROM regions.users WHERE worker_id = $1`;
        let resp = await query(textQuery, [worker_id]);
        if (resp.rowCount > 0) {
            return reply.code(409).send({ error: "Ese trabajador ya posee un usuario", status: "failed" });
        }

        // Check if username already exists
        textQuery = `SELECT * FROM regions.users WHERE username = $1`;
        resp = await query(textQuery, [username]);
        if (resp.rowCount > 0) {
            return reply.code(409).send({ error: "El nombre de usuario ya esta en uso", status: "failed" });
        }

        // Encrypt the password
        const pass = encrypt(password);

        // Insert the new user
        textQuery = `INSERT INTO regions.users (worker_id, username, password, role_id) VALUES ($1, $2, $3, $4)`;
        resp = await query(textQuery, [worker_id, username, pass, role_id]);

        // Check if the user was created successfully
        if (resp.rowCount == 0) {
            return reply.code(409).send({ error: "error en la petición", status: "failed" });
        }

        return reply.send({ status: "ok", msg: `Se registro con exito` });
    } catch (error) {
        return reply.code(500).send({ error: "internal server error", status: "failed" });
    }
}

module.exports = {
    getAllUser,
    getUserById,
    updatetUser,
    changeUserStatus,
    createUser
}