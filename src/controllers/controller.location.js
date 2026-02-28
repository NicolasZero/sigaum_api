const { query } = require("../db/postgresql");

const stateBy = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT * FROM states WHERE id = $1`, [id])
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

const statesAll = async (request, reply) => {
    try {
        const response = await query('SELECT * FROM states')
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

const municipalityBy = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT id, municipality FROM municipalities WHERE state_id = $1`, [id])
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

const municipalitiesAll = async (request, reply) => {
    try {
        const response = await query('SELECT id, municipality FROM municipalities')
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

const parishBy = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT id, parish FROM parishes WHERE municipality_id = $1`, [id])
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

const parishAll = async (request, reply) => {
    try {
        const response = await query('SELECT id, parish FROM parishes')
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

module.exports = { stateBy, statesAll, municipalitiesAll, municipalityBy, parishAll, parishBy}