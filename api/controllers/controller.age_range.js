const { query } = require("../db/postgresql");

const getAll = async (request, reply) => {
    try {
        const resp = await query(`SELECT * FROM regions.age_range WHERE id != 0`)
        return reply.code(200).send({ status: "OK", data: resp.rows, rowCount: resp.rowCount })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

module.exports = { getAll }