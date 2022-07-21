const oracledb = require('oracledb');
// hr schema password
var password = 'PoloMarco22';
// checkConnection asycn function

async function checkConnection() {
    try {
        connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: password,
            connectString: "localhost:1521/xe"
        });
        console.log("Successfully connected to Oracle!")
    } catch (err) {
        console.error(err.message);
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

checkConnection();