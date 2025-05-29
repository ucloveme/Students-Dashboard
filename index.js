import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import studentRoutes from './routes/studentRoutes.js';
import sequelize from './config/db.js';
import Student from './models/User.js';

dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "SESSION_SECRET",
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(studentRoutes);

try {
  await sequelize.sync();
  app.listen(PORT , ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});
} catch (error) {
  console.error('Database connection failed:', error);
}

