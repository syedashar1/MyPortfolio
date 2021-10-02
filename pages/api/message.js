import nc from 'next-connect';
import User from '../../models/User';
import db from '../../utils/db';

const handler = nc(); 
handler.put(async (req, res) => {
        await db.connect()
        const users = await User.find({})
        const user = users[0] ;
        console.log(user.messages);
        user.messages.push(req.body)
        await user.save()
        res.send('Hi , Thanks i will contact as soon as possible!')
        await db.disconnect()
        return ;
});

export default handler;