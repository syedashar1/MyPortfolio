import nc from 'next-connect';
import Project from '../../../models/Project';
import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';

const handler = nc()
handler.use(isAuth);
handler.post(async (req, res) => {
  
        await db.connect();
        const newProject = new Project(req.body)
        const x = await newProject.save();
        await db.disconnect();
        res.send(x.slug)
        console.log(x);


});

export default handler;