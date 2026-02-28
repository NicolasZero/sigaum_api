const { query } = require("../db/postgresql");

const getAllPreviously = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.view_achievements where previously_scheduled = true;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getAllScheduled = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.view_achievements where status_id = 2;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAllPreviously = async (request, reply) => {
    try {
        const textQuery = `SELECT count(*) FROM regions.view_achievements where previously_scheduled = true;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAll = async (request, reply) => {
    try {
        const textQuery = `SELECT count(*) FROM regions.view_achievements where status_id = 2;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAllForMonth = async (request, reply) => {
    try {
        const { month, year } = request.params
        if (!Number(year) || !Number(month)) {
            return reply.code(400).send({ error: "year or month not valid", status: "failed" });
        }
        const textQuery = `SELECT count(*) FROM regions.view_achievements WHERE status_id = 2 AND extract(month FROM date) = ${month} AND extract(year FROM date) = ${year};`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAllPreviouslyForMonth = (filter) => async (request, reply) => {
    try {
        const { month, year } = request.params
        if (!Number(year) || !Number(month)) {
            return reply.code(400).send({ error: "year or month not valid", status: "failed" });
        }
        const textQuery = `SELECT count(*) FROM regions.view_achievements where previously_scheduled = true AND extract(month FROM date) = ${month} AND extract(year FROM date) = ${year};`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getAllScheduledbyUser = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT * FROM regions.view_achievements where previously_scheduled = true AND user_id = $1;`
        const resp = await query(textQuery,[id])
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getScheduledById = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT * FROM regions.view_achievements WHERE id = $1;`
        const resp = await query(textQuery, [id])
        return reply.send({ status: "ok", msg: `Se encontro ${resp.rowCount} resultado`, data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const updateScheduled = async (request, reply) => {
    if (!request.body) {
        return reply.code(400).send({ error: "body empty not valid", status: "failed" });
    }
    const { id } = request.body
    let base = false
    try {
        const {n_womans, n_man, observation,status_id } = request.body

        // sql
        let textQuery = `UPDATE regions.achievements_base
        SET observation = $1, status_id = $2
        WHERE id = $3;`
        // Ejecuta el sql
        let resp = await query(textQuery, [observation,status_id,id])        

        // en caso de no encontrar el id, base es true
        if (resp.rowCount == 0) {
            base = true
        }

        textQuery = `UPDATE regions.achievements_others
        SET n_womans = $1, n_man = $2
        WHERE achievements_id = $3;`
        resp = await query(textQuery, [n_womans, n_man, id])

        return reply.send({ status: "ok", msg: `Se actualizaron ${resp.rowCount}`, data: resp.rowCount });
    } catch (error) {
        if (base) {
            await query("UPDATE regions.achievements_base SET date = '1900-01-01', observation = '', status_id = 2 WHERE id = $1;", [id])
        }
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

module.exports = {
    getAllScheduled,
    getScheduledById,
    updateScheduled,
    getAllScheduledbyUser,
    getAllPreviously,
    countAllPreviously,
    countAll,
    countAllForMonth,
    countAllPreviouslyForMonth
}