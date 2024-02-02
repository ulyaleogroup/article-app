import { Sequelize } from "sequelize";

const sequelize = new Sequelize('jwtexpress', 'root', 'Mysqls1234', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize