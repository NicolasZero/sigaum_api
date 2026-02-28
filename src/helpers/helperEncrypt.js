const bcrypt = require('bcryptjs')

const encrypt = (text) => {
    const hash = bcrypt.hashSync(text, 10);
    return hash
}

const compare = (password, hashPassword) =>{
    return bcrypt.compare(password,hashPassword)
}

module.exports = {
    encrypt,
    compare
}