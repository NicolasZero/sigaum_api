const { query } = require("../db/postgresql");

const getAllWorker = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM general.view_workers;`
        const resp = await query(textQuery)
        return reply.send({status: "ok", msg:`Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getWorkerById = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT * FROM general.view_workers WHERE id = $1;`
        const resp = await query(textQuery,[id])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getWorkerByIc = async (request, reply) => {
    try {
        const ic = request.params.ic
        const textQuery = `SELECT * FROM general.view_workers WHERE identity_card = $1;`
        const resp = await query(textQuery,[ic])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const setWorker = async (request, reply) => {
    try {
        return "En progreso"
        if (!request.body) {
            return reply.code(400).send({ error: "body not valid", status: "failed" });
        }

        const {worker_id, workername, password, role_id} = request.body

        // Request body verification
        if (worker_id !== "number" || typeof role_id !== "number" || typeof workername !== "string" || typeof password !== "string") {
            return reply.code(400).send({ error: "body not valid", status: "failed" })
        }

        const textQuery = `INSERT INTO regions.workers (worker_id, workername, password, role_id) VALUES ($1, $2, $3, $4);`
        const resp = await query(textQuery,[worker_id, workername, password, role_id])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error) ;
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const updateWorker = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body not valid", status: "failed" });
        }
        const {id,is_active} = request.body

        // Request body verification
        if (id !== "number" || typeof is_active !== "boolean") {
            return reply.code(400).send({ error: "body not valid", status: "failed" })
        }
        
        const textQuery = `UPDATE regions.workers SET is_active = $1 WHERE id = $2;`
        const resp = await query(textQuery,[is_active,id])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error) ;
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

module.exports = {
    getAllWorker,
    getWorkerById,
    getWorkerByIc,
    setWorker,
    updateWorker
}