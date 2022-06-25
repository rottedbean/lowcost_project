import * as mysql from "mysql";
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "card_data",
});
connection.connect();

export { connection };
