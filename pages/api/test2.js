import nc from 'next-connect';
import Project from '../../models/Project';
import db from '../../utils/db';

const handler = nc(); 
handler.get(async (req, res) => {
        try {
                await db.connect()
                const projects = await Project.find({})
                res.send(projects)
                db.disconnect()
                return ;
        } catch (error) {
                
        }
});

export default handler;