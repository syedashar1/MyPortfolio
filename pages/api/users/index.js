import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById( req.user._id )
  await db.disconnect();
  res.send(user)
});



export default handler;