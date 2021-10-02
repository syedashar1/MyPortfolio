import nc from 'next-connect';
import User from '../../models/User';
import db from '../../utils/db';

const handler = nc(); 
handler.get(async (req, res) => {
        try {
        await db.connect()
        const users = await User.find({})
        const user = users[0] ;
        res.send(user)
        db.disconnect()
        return ;
        } catch (error) {
                
        }
});

export default handler;