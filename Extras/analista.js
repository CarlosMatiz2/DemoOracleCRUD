async function selectAnalistaById(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        // console.log("Successfully connected to Oracle!")
        result = await connection.execute(`SELECT * FROM ANALISTA where ID_ANALISTA=:id`, [id]);
   
    } catch (err) {
        //send error message
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
            } catch (err) {
                console.error(err.message);
            }
        }
        if (result.rows.length == 0) {
            //query return zero analistas
            return res.send([['Query send no rows']]);
            // return res.send('Query send no rows');
        } else {
            //send all employees
            return result.rows;
        }

    }
}

analista.get('/getAnalista', function (req, res) {
    res.render('analista');
});

analista.get('/user', function (req, res) {
    //get query param ?id
    let id = req.query.id;
    // id param if it is number
    if (isNaN(id)) {
      res.send('Query param id is not number')
      return
    }
    selectAnalistaById(req, res, id);
})