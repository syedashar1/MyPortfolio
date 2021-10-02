import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {

    fullName : {type : String } ,
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePic : { type: String, default : 'https://www.nicepng.com/png/full/522-5226533_get-beyond-the-usual-suspects-profile-pic-icon.png' },
    password : {type : String , required : true} ,
    fb : {type: String } ,
    insta : {type: String } ,
    github : {type: String } ,
    upwork : {type: String } ,
    freelancer : {type: String } ,
    contact : {type : String } ,
    smallBio : {type : String } ,
    bigBio : {type : String } ,
    skills : {type : String } ,
    skillsBio : {type : String , default : 'this is skill bio' } ,
    lastUpdatedSkills : {type : String } ,

    timeSpent:[{
      visitor : [String] ,
      dateVisited : {type : String} ,
      seconds : {type : Number , default : 0}
    }] ,


    messages :[{
      email : {type : String} ,
      message : {type : String } ,
      at : {type : Date , default : Date.now }
    }]


  },
  {
    timestamps: true,
  }
);

const User =  mongoose.models.Userr || mongoose.model('Userr', userSchema);
export default User;