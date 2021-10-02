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

  if ( !bcrypt.compareSync(req.body.password, user.password)){res.status(500).send({message:'Invalid Password'}) ; return }


  // user.password = req.body.password
  //   ? bcrypt.hashSync(req.body.password)
  //   : user.password;


  user.name = req.body.name
  user.email= req.body.email
  user.fullName= req.body.fullName
  user.fb = req.body.fb
  user.insta = req.body.insta
  user.github = req.body.github
  user.upwork = req.body.upwork
  user.freelancer= req.body.freelancer
  user.contact = req.body.contact
  user.smallBio= req.body.smallBio
  user.bigBio = req.body.bigBio



  await user.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler