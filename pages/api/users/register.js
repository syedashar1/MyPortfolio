import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {

  await db.connect();


  const users = await User.find({})
  if(users.length !== 0) {
    res.status(500).send({message:'An account is already created.'})
    await db.disconnect();
    return ;
  }

  
  const newUser = new User(req.body)
  newUser.password = bcrypt.hashSync(req.body.password)


  const user = await newUser.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
  });
});

export default handler;