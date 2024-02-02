import express from "express";
import sequelize from "./src/configs/db.js";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import 'dotenv/config'

const app = express();
const port = 8000

app.use(express.json());
app.use(cookieParser());

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
app.use(routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})