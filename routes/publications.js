const express = require('express')
const oracledb = require('oracledb');
// https://github.com/oracle/node-oracledb/tree/main/examples
var publication = express.Router();
require('dotenv').config();
var password = 'PoloMarco22';

publication.get('/getAllPublications', function (req, res) {
    res.render('publications');
});

publication.get('/createPublication', function (req, res) {
    res.render('createPublication');
});

publication.get('/publications', function (req, res) {
    p_selectAllPublications(req, res);
});

publication.get('/editPublication/:id', function (req, res) {
    (async () => {
       var user = await p_selectPublicationByIdEdit(req, res, parseInt(req.params.id));
       res.render('editPublication', {
            name: user[0][0], description: user[0][3], iduser: user[0][4],
            idcategory: user[0][1], bannerimage: user[0][5], id: user[0][7]
            }
        );
    })()
});

publication.delete('/deletePublication', function (req, res) {
    // id param if it is number
    let id = req.query.id;
    if (isNaN(id)) {
        res.send('Query param id is not number')
        return
      }
      p_deletePublicationById(req, res, id);
})

publication.post('/createPublication', function (req, res) {

    let user = {
                "name": req.body.name,
                "description": req.body.description,
                "iduser": req.body.iduser,
                "idcategory": req.body.idcategory,
                "bannerimage": req.body.bannerimage};

    console.log(user);

    p_createPublication(req, res, user);
})

publication.post('/editPublication', function (req, res) {

    let user = {"idPublication": parseInt(req.body.idPublication),
                "name": req.body.name,
                "description": req.body.description,
                "iduser": req.body.iduser,
                "idcategory": req.body.idcategory,
                "bannerimage": req.body.bannerimage};

    console.log(user);

    p_editPublication(req, res, user);
})

publication.get('/example', function (req, res) {
    p_selectAllPublications(req, res);
});

async function p_selectAllPublications(req, res) {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });

        await connection.execute(`    
            CREATE OR REPLACE PROCEDURE lista_publicaciones(cursorParam OUT SYS_REFCURSOR)
            IS
            BEGIN 
                OPEN cursorParam FOR
                    SELECT * FROM PUBLICATIONS; 
            END;
        `);

        result = await connection.execute(`      
            BEGIN
                lista_publicaciones(:cursor); 
            END;
        `,{cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});

        const resultSet1 = result.outBinds.cursor;

        // console.log("Cursor metadata:");
        // console.log(resultSet1.metaData);
    
        const rows1 = await resultSet1.getRows();  // no parameter means get all rows
        console.log(rows1);
    
        await resultSet1.close(); // always close the ResultSet

        return res.send(rows1);

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
    }
}

async function p_deletePublicationById(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });

        await connection.execute(`    
            CREATE OR REPLACE PROCEDURE eliminar_publicacion(idPublicacion IN NUMBER)
            IS
            BEGIN 
                DELETE FROM PUBLICATIONS where ID = idPublicacion;
            END;
        `);

        result = await connection.execute(`
                BEGIN
                    eliminar_publicacion(:id); 
                END;
            `, 
            {"id": id}, 
            {autoCommit: true}
        );

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
        return res.send(result);   
    }
}

async function p_createPublication(req, res, user) {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });

        await connection.execute(`    
            CREATE OR REPLACE PROCEDURE crear_publicacion(name IN VARCHAR2, description IN VARCHAR2, 
                idUser IN NUMBER, idCategory IN NUMBER, bannerImage IN VARCHAR2)
            IS
            BEGIN 
                INSERT INTO PUBLICATIONS (NAME, DESCRIPTION, IDUSER, IDCATEGORY, BANNERIMAGE, PUBLISHEDAT) 
                    VALUES(name, description, idUser, idCategory, bannerImage, CURRENT_DATE);
            END;
        `);

        result = await connection.execute(`
                BEGIN
                    crear_publicacion(:name, :description, :iduser, :idcategory, :bannerimage); 
                END;
            `, 
            user, 
            {autoCommit: true}
        );

        console.log(result);

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
       
        //return res.send(result);  
        return res.render('publications'); 
        // return res.render('analistas');
    }
}

async function p_editPublication(req, res, user) {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });

        await connection.execute(`    
            CREATE OR REPLACE PROCEDURE actualizar_publicacion(idPublication IN NUMBER, nameP IN VARCHAR2, descriptionP IN VARCHAR2, idUserP IN NUMBER, idCategoryP IN NUMBER, bannerImageP IN VARCHAR2)
            IS
            BEGIN 
            UPDATE PUBLICATIONS SET NAME = nameP, DESCRIPTION = descriptionP, IDUSER = idUserP, 
                    IDCATEGORY = idCategoryP, BANNERIMAGE = bannerImageP WHERE ID = idPublication;  
            END;            
        `);

        result = await connection.execute(`
                BEGIN
                    actualizar_publicacion(:idPublication, :name, :description, :iduser, :idcategory, :bannerimage); 
                END;
            `, 
            user, 
            {autoCommit: true}
        );

        console.log(result);

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
       
        // return res.send(result);   
        return res.render('publications');
    }
}

async function p_selectPublicationByIdEdit(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });

        await connection.execute(`    
            CREATE OR REPLACE PROCEDURE lista_publicaciones_by_id(cursorParam OUT SYS_REFCURSOR, idPublication IN NUMBER)
            IS
            BEGIN 
                OPEN cursorParam FOR
                    SELECT * FROM PUBLICATIONS WHERE ID = idPublication; 
            END;
        `);

        result = await connection.execute(`      
            BEGIN
                lista_publicaciones_by_id(:cursor, :id); 
            END;
        `,
            {"id":id,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});

        const resultSet1 = result.outBinds.cursor;

        // console.log("Cursor metadata:");
        // console.log(resultSet1.metaData);

        const rows1 = await resultSet1.getRows();  // no parameter means get all rows
        console.log(rows1);

        await resultSet1.close(); // always close the ResultSet

        return rows1;
   
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
    }
}

async function selectAllPublications(req, res) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        // console.log("Successfully connected to Oracle!")
        result = await connection.execute(`SELECT * FROM PUBLICATIONS`);

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
            return res.send('Query send no rows');
        } else {
            //send all employees
            return res.send(result.rows);
        }

    }
}

async function deletePublicationById(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        result = await connection.execute(`DELETE FROM PUBLICATIONS where ID=:id`, {"id": id}, {
            autoCommit: true
        });

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
        return res.send(result);   
    }
}

async function createPublication(req, res, user) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        result = await connection.execute(
            `INSERT INTO PUBLICATIONS (NAME, DESCRIPTION, IDUSER, IDCATEGORY, BANNERIMAGE, PUBLISHEDAT) 
            VALUES(:name, :description, :iduser, :idcategory, :bannerimage, CURRENT_DATE)`, 
            user, {
                autoCommit: true
            });

        console.log(result);

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
       
        return res.send(result);   
        // return res.render('analistas');
    }
}

async function editPublication(req, res, user) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        result = await connection.execute(
            `UPDATE PUBLICATIONS SET NAME = :name, DESCRIPTION = :description, IDUSER = :iduser,
             IDCATEGORY = :idcategory, BANNERIMAGE = :bannerimage WHERE ID = :idPublication`, 
            user, {
                autoCommit: true
            });

        console.log(result);

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
       
        // return res.send(result);   
        return res.render('publications');
    }
}

async function selectPublicationByIdEdit(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });

        result = await connection.execute(`SELECT * FROM PUBLICATIONS where ID=:id`, [id]);
   
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
            // query return zero analistas
            // return res.send([['Query send no rows']]);
            // return res.send('Query send no rows');
        } else {
            //send all employees
            return result.rows;
        }

    }
}

module.exports = publication;