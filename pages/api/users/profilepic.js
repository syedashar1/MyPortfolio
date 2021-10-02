import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken, isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);
  user.profilePic = req.body.profilePic
  await user.save();
  await db.disconnect();
  res.send('Done');
});

export default handler