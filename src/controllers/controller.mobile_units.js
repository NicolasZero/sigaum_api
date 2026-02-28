const { query } = require("../db/postgresql");

const getAll = (filter) => async (request, reply) => {
    try {
        const textQuery = `SELECT * FROM regions.mobile_units ${filter};`
        const resp = await query(textQuery)
        return reply.send({ status: "ok", msg: `Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const countAll = (filter) => async (request, reply) => {
    try {
        const { month, year } = request.params;
        const textQuery = `SELECT count(*) FROM regions.mobile_units ${filter}`;
        const resp = await query(textQuery, [month, year]);
        return reply.send({ status: "ok", data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}


const countAllForMonth = (filter) => async (request, reply) => {
    try {
        const { month, year } = request.params
        if (!Number(year) || !Number(month)) {
            return reply.code(400).send({ error: "year or month not valid", status: "failed" });
        }
        const textQuery = `SELECT count(*) FROM regions.mobile_units ${filter};`
        const resp = await query(textQuery,[month, year])
        return reply.send({ status: "ok", data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getByUser = (filter) => async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT * FROM regions.mobile_units WHERE user_id = $1 ${filter};`
        const resp = await query(textQuery, [id])
        return reply.send({ status: "ok", msg: `Se encontro ${resp.rowCount} resultado`, data: resp.rows });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getById = async (request, reply) => {
    try {
        const id = request.params.id
        const resp = await query(`SELECT * FROM regions.mobile_units WHERE id = $1;`, [id])
        return reply.send({ status: "ok", msg: `Se encontro ${resp.rowCount} resultado`, data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getDetailsById = async (request, reply) => {
    try {
        const id = request.params.id
        
        let data = {}
        let resp = await query(`SELECT id, service_type, subtype, disability, age_range FROM regions.mobile_units_disability WHERE social_day_id = $1;`, [id])
        data.disability = resp.rows

        resp = await query(`SELECT id, service_type, subtype, ethnicity, age_range FROM regions.mobile_units_ethnicity WHERE social_day_id = $1;`, [id])
        data.ethnicity = resp.rows

        resp = await query(`SELECT id, service_type, subtype, age_range FROM regions.mobile_units_service WHERE social_day_id = $1;`, [id])
        data.service = resp.rows

        return reply.send({ status: "ok", msg: `Busqueda exitosa`, data });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const getStatisticsAnnual = async (request, reply) => {
    try {
        const {year} = request.params
        if (!Number(year)) {
            return reply.code(400).send({ error: "year not valid", status: "failed" });
        }
        const textQuery = `
            SELECT m.month , coalesce(s.finished,0) as finished, coalesce(s.unfinished,0) as unfinished 
            FROM (
                SELECT 
                    extract(month FROM date) AS month,
                    COUNT(CASE WHEN status_id = 1 THEN status_id ELSE NULL END) AS finished,
                    COUNT(CASE WHEN status_id != 1 THEN status_id ELSE NULL END) AS unfinished
                FROM regions.social_day_achievements
                WHERE EXTRACT(YEAR FROM date) = ${year}
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

const insert = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body empty not valid", status: "failed" });
        }
        const {
            id,
            cantMobileUnitsRequired,
            cantUltrasoundRequired,
            logisticalSupport,
            state,
            municipality,
            parish,
            place,
            responsible,
            approximate,
            obs,
            date
        } = request.body

        const textQuery = `
            INSERT INTO regions.social_day_achievements(
            created_by, date, num_mobile_units, num_ultrasounds, responsible, state_id, municipality_id, parish_id, place, approximate, logistical_support, observation1)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
        const value = [id, date, cantMobileUnitsRequired, cantUltrasoundRequired, responsible, state, municipality, parish, place, approximate, logisticalSupport, obs]
        const resp = await query(textQuery, value)

        if (resp.rowCount == 0) {
            return reply.code(500).send({ error: "No se logro registrar", status: "failed" });
        }

        return reply.send({ status: "ok", msg: `Se registro con exito` });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

const insertDetails = async (request, reply) =>{
    try {
        if (!request.body) {
            return reply.code(400).send({ error: "body empty not valid", status: "failed" });
        }
        const {
            id,
            obs2,
            attentionTypes,
            status
        } = request.body

        // Verifica que el id de la unidad movil exista
        let verification = await query(`SELECT * FROM regions.social_day_achievements WHERE id = $1;`,[id])

        if (verification.rowCount == 0) {
            return reply.code(500).send({ error: "No se logro registrar", status: "failed" });
        }

        // === Verifica que no exista otro detalle de unidad movil === //
        // discapacidad
        verification = await query(`SELECT * FROM regions.social_day_disability WHERE social_day_id = $1;`,[id])
        if (verification.rowCount != 0) {
            return reply.code(500).send({ error: "Ya existe un registro", status: "failed" });
        }

        // Servicios
        verification = await query(`SELECT * FROM regions.social_day_service_types WHERE social_day_id = $1;`,[id])
        if (verification.rowCount != 0) {
            return reply.code(500).send({ error: "Ya existe un registro", status: "failed" });
        }

        // Etnia
        verification = await query(`SELECT * FROM regions.social_day_ethnicity WHERE social_day_id = $1;`,[id])
        if (verification.rowCount != 0) {
            return reply.code(500).send({ error: "Ya existe un registro", status: "failed" });
        }

        // Actualiza la observacion
        if (status !== "Completada") {            
            await query(`UPDATE regions.social_day_achievements SET observation2 = $1, status_id = 3 WHERE id = $2;`,[obs2, id])
            return reply.send({ status: "ok", msg: `Se actualizo con exito` });
        }

        // Variables para los foreach
        // Tipo de atencion
        let textType = `${id},`
        let textTypeValue = ""

        // Discapacidad
        let textDisability = `${id},`
        let textDisabilityValue = ""

        // Etnia
        let textEthnicity = `${id},`
        let textEthnicityValue = ""

        // contadores para los foreach
        let a = 1 // Tipo
        let b = 1 // Discapacidad
        let c = 1 // Etnia

        attentionTypes.forEach(attention => {
            attention.ageRanges.forEach(e => {
                textType += `${attention.type},${attention.subType?attention.subType:0},${e.range},${e.men},${e.women},`
                textTypeValue += `($1,$${a+1},$${a+2},$${a+3},$${a+4},$${a+5}),`
                a += 5
            })

            if (attention.disabilities) {
                attention.disabilities.forEach(disability => {
                    disability.ageRanges.forEach(e => {
                        textDisability += `${attention.type},${attention.subType?attention.subType:0},${disability.type},${e.range},${e.men},${e.women},`
                        textDisabilityValue += `($1,$${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6}),`
                        b += 6
                    })
                })
            }


            attention.ethnicities.forEach(ethnicity => {
                ethnicity.ageRanges.forEach(e => {
                    textEthnicity += `${attention.type},${attention.subType?attention.subType:0},${ethnicity.type},${e.range},${e.men},${e.women},`
                    textEthnicityValue += `($1,$${c+1},$${c+2},$${c+3},$${c+4},$${c+5},$${c+6}),`
                    c += 6
                })
            })
        })

        // ===== Tipo de servicio ===== //
        let values = textType.slice(0, -1).split(",") // Transformar en array y eliminar la ultima coma
        let textInsert = textTypeValue.slice(0, -1) // Eliminar la ultima coma
        let textQuery = `INSERT INTO regions.social_day_service_types(social_day_id,service_type_id,service_subtype_id,age_range_id,n_mans,n_womans) VALUES ${textInsert};`

        let resp = await query(textQuery, values)

        if (resp.rowCount == 0) {
            return reply.code(500).send({ error: "No se logro registrar", status: "failed" });
        }

        // ===== Discapacidad ===== //

        if (textDisabilityValue != "") {
            values = textDisability.slice(0, -1).split(",")
            textInsert = textDisabilityValue.slice(0, -1)
            textQuery = `INSERT INTO regions.social_day_disability (social_day_id,service_type_id,service_subtype_id,disability_id,age_range_id,n_mans,n_womans) VALUES ${textInsert};`
    
            resp = await query(textQuery, values)
    
            if (resp.rowCount == 0) {
                query(`DELETE FROM regions.social_day_service_types WHERE social_day_id = $1;`,[id])
                return reply.code(500).send({ error: "No se logro registrar", status: "failed" });
            }
        }


        // ===== Etnia ===== //
        values = textEthnicity.slice(0, -1).split(",")
        textInsert = textEthnicityValue.slice(0, -1)
        textQuery = `INSERT INTO regions.social_day_ethnicity (social_day_id,service_type_id,service_subtype_id,ethnicity_id,age_range_id,n_mans,n_womans) VALUES ${textInsert};`

        resp = await query(textQuery, values)

        if (resp.rowCount == 0) {
            await query(`DELETE FROM regions.social_day_service_types WHERE social_day_id = $1;`,[id])
            await query(`DELETE FROM regions.social_day_disability WHERE social_day_id = $1;`,[id])
            return reply.code(500).send({ error: "No se logro registrar", status: "failed" });
        }

        let changestatus = 2
        if (status == "Completada") {
            changestatus = 1
        }else{ 
            changestatus = 3
        }

        await query(`UPDATE regions.social_day_achievements SET observation2 = $1, status_id = ${changestatus} WHERE id = $2;`,[obs2, id])

        return reply.send({ status: "ok", msg: `Se registro con exito` });

    } catch (error) {
        // Elimina si falla
        const {id} = request.body
        await query(`DELETE FROM regions.social_day_service_types WHERE social_day_id = $1;`,[id])
        await query(`DELETE FROM regions.social_day_disability WHERE social_day_id = $1;`,[id])
        await query(`DELETE FROM regions.social_day_ethnicity WHERE social_day_id = $1;`,[id])
        console.log(error, id);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

module.exports = {
    getAll,
    getById,
    insert,
    insertDetails,
    getByUser,
    getDetailsById,
    getStatisticsAnnual,
    countAll,
    countAllForMonth
}