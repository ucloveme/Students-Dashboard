import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Studentinfo = sequelize.define('StudentInfo', {

id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
},
fullName: {
    type: DataTypes.STRING,
    allowNull: false,
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        isEmail: true,
    },
},
phone:{
    type: DataTypes.STRING,
    allowNull: false,
},
dob:{
    type: DataTypes.DATE,
    allowNull: false,
},
department: {
    type: DataTypes.STRING,
    allowNull: false,
},
password: {
    type: DataTypes.STRING,
    allowNull: false,
},
profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
},
})

export default Studentinfo;
