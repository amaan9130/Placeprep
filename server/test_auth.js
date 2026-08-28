import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { memoryStores } from './config/memoryStore.js';

setTimeout(async () => {
  const user = await User.findOne({ email: 'student@placeprep.edu' });
  console.log('Found user:', user?.name, 'ID:', user?._id);

  const token = jwt.sign({ id: user._id, role: user.role }, 'placeprep_super_secret_jwt_key_2026');
  const decoded = jwt.verify(token, 'placeprep_super_secret_jwt_key_2026');
  console.log('Decoded ID:', decoded.id);

  const userById = await User.findById(decoded.id);
  console.log('User by ID:', userById?.name);
  process.exit(0);
}, 500);