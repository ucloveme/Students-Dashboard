import bcrypt from 'bcryptjs';
import Studentinfo from '../models/User.js';
import fs from 'fs';
import path from 'path';


export const register = async (req, res) => {
  const { fullName, email, phone, gender, dob, department, password, confirmPassword } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  const old = req.body;

  try {
    // 1. Check for missing fields
    if (!fullName || !email || !phone || !gender || !dob || !department || !password || !confirmPassword) {
      return res.render('register', {
        error: 'All fields are required',
        old
      });
    }

    // 2. Check password match
    if (password !== confirmPassword) {
      return res.render('register', {
        error: 'Passwords do not match',
        old
      });
    }

    // 3. Check if user already exists
    const existingStudent = await Studentinfo.findOne({ where: { email } });
    if (existingStudent) {
      return res.render('register', {
        error: 'Email is already registered',
        old
      });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new student
    await Studentinfo.create({
      fullName,
      email,
      phone,
      gender,
      dob,
      department,
      password: hashedPassword,
      profilePic
    });

    // 5. Success
    res.redirect('/login'); // or wherever your login route is

  } catch (err) {
    console.error(err);
    res.render('register', {
      error: 'An unexpected error occurred. Please try again.',
      old
    });
  }
};



export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const student = await Studentinfo.findOne({ where: { email } });

    if (!student) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.studentId = student.id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Incorrect email or password. Please try again.' });
  }
}

export async function dashboard(req, res) {
  const student = await Studentinfo.findByPk(req.session.studentId);
  res.render('dashboard', { student });
}


// Render edit info page
export async function editInfo(req, res) {
  const student = await Studentinfo.findByPk(req.session.studentId);


  if (req.method === 'GET') {
    return res.render('editInfo', { student 
     });
  }

  const { fullName, email, phone, gender, dob, department } = req.body;
  let profilePic = student.profilePic;

  if (req.file) {
    // Delete old profile picture if it's not the default one
    if (student.profilePic && student.profilePic !== 'default.jpg') {
      const oldPicPath = path.join('public', 'uploads', student.profilePic);
      fs.unlink(oldPicPath, (err) => {
        if (err) {
          console.error('Error deleting old profile picture:', err);
        }
      });
    }
    profilePic = req.file.filename;
  }

  await Studentinfo.update(
    { fullName, email,  phone, gender, dob, department,profilePic },
    { where: { id: req.session.studentId } }
  );

  res.redirect('/dashboard');
}


export function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

export async function deleteAccount(req, res) {
  const student = await Studentinfo.findByPk(req.session.studentId);

  // Delete profile picture if not default
  if (student.profilePic && student.profilePic !== 'default.jpg') {
    const picPath = path.join('public', 'uploads', student.profilePic);
    fs.unlink(picPath, (err) => {
      if (err) console.error('Error deleting profile picture:', err);
    });
  }

  await student.destroy();
  req.session.destroy(() => res.redirect('/register'));
}
