import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mainPic : {type : String } ,
    stack : {type : String } ,
    images : [String] ,
    timeSpan : {type : String} ,
    link : { type : String } ,
    githubLink : {type : String} ,
    slug : {type : String , required : true} ,
    description : {type : String , default : 'This is the description of the project.'} ,
    skills : {type : String} ,
    smallBio : { type : String } ,
    bigBio : {type : String } ,
  },
  {
    timestamps: true,
  }
);

const Project =  mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;