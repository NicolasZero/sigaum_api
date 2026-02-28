const { query } = require("../db/postgresql");

const getAll = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.view_achievements where status_id = 1;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAll = async (request, reply) => {
    try {
        const textQuery = `SELECT count(*) FROM regions.view_achievements where status_id = 1;`
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
        const textQuery = `SELECT count(*) FROM regions.view_achievements WHERE status_id = 1 AND extract(month FROM date) = ${month} AND extract(year FROM date) = ${year};`
        const resp = await query(textQuery)
        return reply.send({ status: "ok",data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getAllByUser = async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.view_achievements where status_id = 1 AND created_by = $1;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getById = async (request, reply) => {
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

const getTableForYear = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        let specificYear1 = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `AND EXTRACT(YEAR FROM b.date) = ${year}`
            specificYear1 = `AND b.year = ${year}`
        }

        // por persona
        const textQuery1 = `
        SELECT
            a1.type_action,
            a2.type_activity,
            SUM(CASE WHEN month = 1 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS enero,
            SUM(CASE WHEN month = 2 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS febrero,
            SUM(CASE WHEN month = 3 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS marzo,
            SUM(CASE WHEN month = 4 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS abril,
            SUM(CASE WHEN month = 5 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS mayo,
            SUM(CASE WHEN month = 6 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS junio,
            SUM(CASE WHEN month = 7 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS julio,
            SUM(CASE WHEN month = 8 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS agosto,
            SUM(CASE WHEN month = 9 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS septiembre,
            SUM(CASE WHEN month = 10 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS octubre,
            SUM(CASE WHEN month = 11 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS noviembre,
            SUM(CASE WHEN month = 12 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS diciembre
        FROM regions.type_activity as a2
        LEFT JOIN regions.type_action as a1 on a1.id = a2.type_action_id
        LEFT JOIN regions.view_achievements_analysis as b on b.activity_id = a2.id AND status_id = 1 ${specificYear1}
        WHERE a1.id != 0
        GROUP BY a2.id, a2.type_activity, a1.type_action
        ORDER BY a2.id ASC;`

        // por logros
        // const textQuery = `
        // SELECT
        //     a1.type_action,
        //     a2.type_activity,
        //     COUNT(CASE WHEN extract(month FROM date) = 1 THEN 1 ELSE NULL END) AS enero,
        //     COUNT(CASE WHEN extract(month FROM date) = 2 THEN 1 ELSE NULL END) AS febrero,
        //     COUNT(CASE WHEN extract(month FROM date) = 3 THEN 1 ELSE NULL END) AS marzo,
        //     COUNT(CASE WHEN extract(month FROM date) = 4 THEN 1 ELSE NULL END) AS abril,
        //     COUNT(CASE WHEN extract(month FROM date) = 5 THEN 1 ELSE NULL END) AS mayo,
        //     COUNT(CASE WHEN extract(month FROM date) = 6 THEN 1 ELSE NULL END) AS junio,
        //     COUNT(CASE WHEN extract(month FROM date) = 7 THEN 1 ELSE NULL END) AS julio,
        //     COUNT(CASE WHEN extract(month FROM date) = 8 THEN 1 ELSE NULL END) AS agosto,
        //     COUNT(CASE WHEN extract(month FROM date) = 9 THEN 1 ELSE NULL END) AS septiembre,
        //     COUNT(CASE WHEN extract(month FROM date) = 10 THEN 1 ELSE NULL END) AS octubre,
        //     COUNT(CASE WHEN extract(month FROM date) = 11 THEN 1 ELSE NULL END) AS noviembre,
        //     COUNT(CASE WHEN extract(month FROM date) = 12 THEN 1 ELSE NULL END) AS diciembre
        // FROM regions.achievements_base as b
        // FULL JOIN regions.type_activity as a2 on a2.id = b.activity_id and status_id = 1 ${specificYear}
        // FULL JOIN regions.type_action as a1 on a1.id = b.action_id
        // WHERE a1.id != 0 AND a2.id != 0 
        // GROUP BY a1.id, a1.type_action, a2.type_activity
        // ORDER BY a1.id;`

        const resp = await query(textQuery1)
        return reply.send({ status: "ok", data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getTableForActivity = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        let specificYear1 = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `AND EXTRACT(YEAR FROM b.date) = ${year}`
            specificYear1 = `AND b.year = ${year}`
        }

        // por personas
        const textQuery1 = `
        SELECT 
            a1.type_action,
            a2.type_activity,
            SUM((b.women + b.men + b.victim_traff + b.g_violence)) AS finished
        FROM regions.type_activity as a2
        LEFT JOIN regions.type_action as a1 on a1.id = a2.type_action_id
        LEFT JOIN regions.view_achievements_analysis as b on b.activity_id = a2.id AND status_id = 1 ${specificYear1}
        WHERE a1.id != 0
        GROUP BY a2.id, a2.type_activity, a1.type_action
        ORDER BY a2.id ASC;`

        // por logros
        // const textQuery = `        
        //     SELECT 
        //         a1.type_action,
        //         a2.type_activity,
        //         count(b.id) as finished
        //     FROM regions.achievements_base as b
        //     FULL JOIN regions.type_activity as a2 on a2.id = b.activity_id AND status_id=1 ${specificYear}
        //     FULL JOIN regions.type_action as a1 on a1.id = b.action_id
        //     WHERE a1.id != 0 AND a2.id != 0 
        //     GROUP BY a1.id, a1.type_action, a2.type_activity
        //     ORDER BY a1.id ASC;`

        const resp = await query(textQuery1)
        return reply.send({ status: "ok", data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getTableForState = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        let specificYear1 = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `AND EXTRACT(YEAR FROM b.date) = ${year}`
            specificYear1 = `AND b.year = ${year}`
        }

        const textQuery1 = `
        SELECT
            s.state,
            SUM(CASE WHEN b.activity_id = 1 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Asesoria Legal",
            SUM(CASE WHEN b.activity_id = 2 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Defensoria Movil",
            SUM(CASE WHEN b.activity_id = 3 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Mesa Tecnica de Justica de Gener",
            SUM(CASE WHEN b.activity_id = 4 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Representacion en Causas Judiciales",
            SUM(CASE WHEN b.activity_id = 5 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Victima de trata",
            SUM(CASE WHEN b.activity_id = 6 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Violencia de Genero",
            SUM(CASE WHEN b.activity_id = 7 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Actuacion Procesal",
            SUM(CASE WHEN b.activity_id = 8 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Atencion Psicologica",
            SUM(CASE WHEN b.activity_id = 9 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Atencion Ginecologica",
            SUM(CASE WHEN b.activity_id = 10 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Casa a Casa",
            SUM(CASE WHEN b.activity_id = 11 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Conversatorio",
            SUM(CASE WHEN b.activity_id = 12 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Punto Violeta",
            SUM(CASE WHEN b.activity_id = 13 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Toma de Espacio",
            SUM(CASE WHEN b.activity_id = 14 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Dinamicas Preventivas",
            SUM(CASE WHEN b.activity_id = 15 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Cine Foro",
            SUM(CASE WHEN b.activity_id = 16 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Atencion Telefonica",
            SUM(CASE WHEN b.activity_id = 17 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Defensoras Comunales Comunitarias",
            SUM(CASE WHEN b.activity_id = 18 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Defensoras Comunales Laborales",
            SUM(CASE WHEN b.activity_id = 19 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Defensoras Comunales Juveniles",
            SUM(CASE WHEN b.activity_id = 20 THEN (b.women + b.men + b.victim_traff + b.g_violence) ELSE 0 END) AS "Otros",
            SUM(coalesce((b.women + b.men + b.victim_traff + b.g_violence),0)) AS total
        FROM regions.view_achievements_analysis as b
        RIGHT JOIN states as s on s.id = b.state_id AND b.status_id = 1 ${specificYear1}
        GROUP BY s.state;`

        // const textQuery = `
        //     SELECT
        //         s.state,
        //         COUNT(CASE WHEN b.activity_id = 1 THEN b.activity_id ELSE NULL END) AS "Asesoria Legal",
        //         COUNT(CASE WHEN b.activity_id = 2 THEN b.activity_id ELSE NULL END) AS "Defensoria Movil",
        //         COUNT(CASE WHEN b.activity_id = 3 THEN b.activity_id ELSE NULL END) AS "Mesa Tecnica de Justica de Gener",
        //         COUNT(CASE WHEN b.activity_id = 4 THEN b.activity_id ELSE NULL END) AS "Representacion en Causas Judiciales",
        //         COUNT(CASE WHEN b.activity_id = 5 THEN b.activity_id ELSE NULL END) AS "Victima de trata",
        //         COUNT(CASE WHEN b.activity_id = 6 THEN b.activity_id ELSE NULL END) AS "Violencia de Genero",
        //         COUNT(CASE WHEN b.activity_id = 7 THEN b.activity_id ELSE NULL END) AS "Actuacion Procesal",
        //         COUNT(CASE WHEN b.activity_id = 8 THEN b.activity_id ELSE NULL END) AS "Atencion Psicologica",
        //         COUNT(CASE WHEN b.activity_id = 9 THEN b.activity_id ELSE NULL END) AS "Atencion Ginecologica",
        //         COUNT(CASE WHEN b.activity_id = 10 THEN b.activity_id ELSE NULL END) AS "Casa a Casa",
        //         COUNT(CASE WHEN b.activity_id = 11 THEN b.activity_id ELSE NULL END) AS "Conversatorio",
        //         COUNT(CASE WHEN b.activity_id = 12 THEN b.activity_id ELSE NULL END) AS "Punto Violeta",
        //         COUNT(CASE WHEN b.activity_id = 13 THEN b.activity_id ELSE NULL END) AS "Toma de Espacio",
        //         COUNT(CASE WHEN b.activity_id = 14 THEN b.activity_id ELSE NULL END) AS "Dinamicas Preventivas",
        //         COUNT(CASE WHEN b.activity_id = 15 THEN b.activity_id ELSE NULL END) AS "Cine Foro",
        //         COUNT(CASE WHEN b.activity_id = 16 THEN b.activity_id ELSE NULL END) AS "Atencion Telefonica",
        //         COUNT(CASE WHEN b.activity_id = 17 THEN b.activity_id ELSE NULL END) AS "Defensoras Comunales Comunitarias",
        //         COUNT(CASE WHEN b.activity_id = 18 THEN b.activity_id ELSE NULL END) AS "Defensoras Comunales Laborales",
        //         COUNT(CASE WHEN b.activity_id = 19 THEN b.activity_id ELSE NULL END) AS "Defensoras Comunales Juveniles",
        //         COUNT(CASE WHEN b.activity_id = 20 THEN b.activity_id ELSE NULL END) AS "Otros",
        //         COUNT(B.*) AS total
        //     FROM regions.achievements_base as b
        //     RIGHT JOIN states as s on s.id = b.state_id AND b.status_id = 1 ${specificYear}
        //     GROUP BY s.state;`
        const resp = await query(textQuery1)
        return reply.send({ status: "ok", data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getTableForGender = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `AND b.year = ${year}`
        }

        const textQuery = `        
        SELECT 
            coalesce(m.month,'SIN REGISTROS') as month,
            coalesce(s.state,'SIN REGISTROS') as state,
            sum(coalesce((women + men + victim_traff + g_violence),0))as people
        FROM regions.view_achievements_analysis as b
        RIGHT JOIN month as m on m.id = b.month AND status_id = 1 ${specificYear}
        RIGHT JOIN states as s on s.id = b.state_id AND status_id = 1 ${specificYear}
        GROUP BY m.month, s.state, m.id, s.id
        ORDER BY m.id, s.id`

        const resp = await query(textQuery)
        return reply.send({ status: "ok", data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}


const getStatisticsAnnual = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `WHERE EXTRACT(YEAR FROM date) = ${year}`
        }

        const textQuery = `
            SELECT m.month , coalesce(s.completado,0) as completado, coalesce(s.no_completado,0) as no_completado 
            FROM (
                SELECT 
                    extract(month FROM date) AS month,
                    COUNT(CASE WHEN status_id = 1 THEN status_id ELSE NULL END) AS completado,
                    COUNT(CASE WHEN status_id != 1 THEN status_id ELSE NULL END) AS no_completado
                FROM regions.view_achievements
                 ${specificYear}
                group by month
            ) as s
            FULL JOIN month as m on m.id = s.month
            WHERE m.id != 0;`
        const resp = await query(textQuery)
        return reply.send({ status: "ok",data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getStatisticsActivity = (specific) => async (request, reply) => {
    try {
        let specificYear = ''
        if (specific) {
            const {year} = request.params
            if (!Number(year)) {
                return reply.code(400).send({ error: "year not valid", status: "failed" });
            }
            specificYear = `AND EXTRACT(YEAR FROM date) = ${year}`
        }
        const textQuery = `
            SELECT 
                type_activity as activity,
	            count(type_activity) as done
            FROM regions.view_achievements
            WHERE status_id = 1 ${specificYear}
            GROUP BY type_activity;`

        const resp = await query(textQuery)
        return reply.send({ status: "ok",data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const insert = async (request, reply) => {
    let id = 0
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body empty not valid", status: "failed" });
        }
        const {
            created_by,
            date,
            hour,
            action_id,
            activity_id,
            management_unit_id,
            state_id,
            municipality_id,
            parish_id,
            observation,
            previously_scheduled,
            observation_scheduled
        } = request.body

        const status = (previously_scheduled) ? 2 : 1

        let textQuery = `INSERT INTO regions.achievements_base (
                        created_by,
                        date,
                        hour,
                        action_id,
                        activity_id,
                        management_unit_id,
                        state_id,
                        municipality_id,
                        parish_id,
                        observation,
                        previously_scheduled,
                        observation_schedule,
                        status_id
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id;`
        let value = [created_by, date, hour, action_id, activity_id, management_unit_id, state_id, municipality_id, parish_id, observation, previously_scheduled, observation_scheduled, status]
        let resp = await query(textQuery, value)
        id = resp.rows[0].id

        if (activity_id == 5) {
            const {
                country_id,
                gender_id,
                age,
                collection_method,
                received
            } = request.body

            textQuery = `INSERT INTO regions.achievements_victim_traff (
                achievements_id,
                country_id,
                gender_id,
                age,
                collection_method,
                received
                ) VALUES ($1, $2, $3, $4, $5, $6);`
            value = [id, country_id, gender_id, age, collection_method, received]
            resp = await query(textQuery, value)
            console.log(resp)
        } else if (activity_id == 6) {
            const {
                age_range_id,
                type_weapon_id,
                type_femicide_id,
                killer_status_id
            } = request.body

            textQuery = `INSERT INTO regions.achievements_g_violence (
                achievements_id,
                age_range_id,
                type_weapon_id,
                type_femicide_id,
                killer_status_id
                ) VALUES ($1, $2, $3, $4, $5);`
            value = [id, age_range_id, type_weapon_id, type_femicide_id, killer_status_id]
            resp = await query(textQuery, value)
            console.log(resp)
        } else if (activity_id == 16) {
            const {
                type_telephone_service_id,
                great_mission
            } = request.body

            textQuery = `INSERT INTO regions.achievements_telephone_service (
                achievements_id,
                type_telephone_service_id,
                great_mission
                ) VALUES ($1, $2, $3);`
            value = [id, type_telephone_service_id, great_mission]
            resp = await query(textQuery, value)
            console.log(resp)
        } else {
            const {
                place_id,
                place_other,
                n_womans,
                n_man,
                n_unspecified,
                responsible,
                phone_number
            } = request.body

            textQuery = `INSERT INTO regions.achievements_others (
                achievements_id,
                place_id,
                place_other,
                n_womans,
                n_man,
                n_unspecified,
                responsible,
                phone_number
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
            value = [id, place_id, place_other, n_womans, n_man, n_unspecified, responsible, phone_number]
            resp = await query(textQuery, value)
            // console.log(resp)
        }

        // console.log(resp);

        if (resp.rowCount == 0) {
            return reply.code(500).send({ error: "error en la peticion", status: "failed" });
        }

        return reply.send({ status: "ok", msg: `Se registro con exito` });
        // return reply.send("En progreso")
    } catch (error) {
        console.log(error);
        if (id !== 0) {
            await query('DELETE FROM regions.achievements_base WHERE id = $1', [id])
        }
        return reply.code(500).send({ error: "error en la peticion", status: "failed", id });
    }
}

module.exports = {
    getAll,
    getById,
    insert,
    getAllByUser,
    getStatisticsAnnual,
    getStatisticsActivity,
    countAll,
    countAllForMonth,
    getTableForYear,
    getTableForActivity,
    getTableForState,
    getTableForGender
}