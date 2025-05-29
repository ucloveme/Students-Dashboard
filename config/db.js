import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false, // Disable logging; default: console.log
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // This is important for self-signed certificates
            }
        },
    }
);
try{
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
}catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;
