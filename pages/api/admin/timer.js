import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = nc(); 
handler.put(async (req, res) => {

        try {
                await db.connect()
                const {timeToAdd , visitor , dateVisited} = req.body;
                const users = await User.find({})
                const user = users[0] ;
                for (let i = 0; i < user.timeSpent.length; i++) {
                        
                        if(dateVisited == user.timeSpent[i].dateVisited){
        
                                if(user.timeSpent[i].visitor.includes(visitor)){
                                        //Date , User Present
                                        user.timeSpent[i].seconds = user.timeSpent[i].seconds + timeToAdd
                                        await user.save()
                                        // await db.disconnect()
                                        return ;
                                }
        
        
                                
                                if(!user.timeSpent[i].visitor.includes(visitor)){
                                        //Date Present
                                        user.timeSpent[i].seconds = user.timeSpent[i].seconds + timeToAdd
                                        user.timeSpent[i].visitor.push(visitor)
                                        await user.save()
                                        // await db.disconnect()
                                        return ;
                                }
        
        
                        }
                        
                }
        
        
                user.timeSpent.push({
                        visitor : [visitor] ,
                        dateVisited : dateVisited ,
                        seconds : timeToAdd
                })
        
                await user.save()
                // await db.disconnect()
                return ;

        } catch (error) {
                console.log(error);
        }

        



});

export default handler;