const db = require("../dbConfig/dbConfig");

const createUser = async (req, res) => {
    const userData = req.body;

    filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!filter.test(userData.email)){
        res.status(400).json({error: 'Invalid Email'});
    }

    if(userData.password.length < 8){
        res.status(400).json({error: 'Invalid Password'});
    }

    const sql = `insert into user (email, password, type, active) 
    values ("${userData.email}", "${userData.password}", "${userData.type}", "${parseInt(userData.active)}")`

    try {
        db.query(sql, (err, result) => {
            console.log(result);
            res.status(200).send(result);
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error})
    }
}

const getUser = async (req, res) => {
    db.query('select * from user', (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({error: error})
        }

        res.status(200).send(result);
    })
}

module.exports = {
    createUser,
    getUser
}