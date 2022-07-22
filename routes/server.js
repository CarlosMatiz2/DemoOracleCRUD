const oracledb = require('oracledb');
require('dotenv').config();
// checkConnection asycn function

async function checkConnection() {
    try {
        connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
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