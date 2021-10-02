import nc from 'next-connect';
import Project from '../../../models/Project';
import db from '../../../utils/db';

const handler = nc()
handler.get(async (req, res) => {
  

        const stack = req.query.s
        await db.connect();
        try {
                const stackFilter = { stack : { $regex: stack=== "all" ? '' : stack , $options: 'i' } } 
                const projects = await Project.find({ ...stackFilter })
                res.send(projects)
                await db.disconnect();
        } catch (error) {
                console.log(error);
        }

});

export default handler;