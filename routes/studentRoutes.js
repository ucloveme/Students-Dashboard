import express from 'express';
import multer from 'multer';
import {
  register,
  login,
  dashboard,
  editInfo,
  logout,
  deleteAccount,
} from '../controllers/studentController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

// Routes
router.get('/', (_, res) => res.render('register'));
router.get('/register', (_, res) => res.render('register'));
router.post('/register/user', upload.single('profilePic'), register);

router.get('/login', (_, res) => res.render('login'));
router.post('/login/user', login);

router.get('/dashboard', isAuthenticated, dashboard);

router.get('/edit-profile', editInfo);
router.post('/edit-profile', upload.single('profilePic'), editInfo);

router.get('/logout', logout);
router.post('/delete-account', isAuthenticated, deleteAccount);

export default router;
