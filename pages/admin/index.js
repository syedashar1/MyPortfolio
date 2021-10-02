import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  CardContent,
  CardActions,
  TextField ,
  Container , LinearProgress , Box
} from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { Store } from '../../utils/store';
import Layout from '../../component/Layout';
import useStyles from '../../utils/styles';

import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { projectStorage, projectFirestore } from '../../firebase/config';

function Admin(props) {


        const { state } = useContext(Store);
        const router = useRouter();
        const classes = useStyles();
        const { userInfo } = state;
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();

        const [progress, setProgress] = useState(0)
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');



        const [fullName, setfullName] = useState('')
        const [fb , setfb] = useState('')
        const [insta , setinsta] = useState('')
        const [ github, setgithub] = useState('')
        const [upwork , setupwork] = useState('')
        const [freelancer , setfreelancer] = useState('')
        const [ contact, setcontact] = useState('')
        const [ smallBio, setsmallBio] = useState('')
        const [ bigBio , setbigBio] = useState('')
        const [profilePic, setProfilePic] = useState('')
        const [TimeSpent, setTimeSpent] = useState([])
        const [Messages, setMessages] = useState([])


        const [file, setFile] = useState(null);
        const [error, setError] = useState(null);

        const types = ['image/png', 'image/jpeg'];


        const convertor = (x) => {
          var sec_num = parseInt(x, 10);
          var hours   = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
          var seconds = sec_num - (hours * 3600) - (minutes * 60);

          if(hours == 0 && minutes ==0 ) return seconds + ' seconds' ;
          if(hours == 0 ) return minutes + ' minutes and ' + seconds + ' seconds' ;
          return hours+' hours '+minutes+' minutes and '+seconds + ' seconds';
      }


        const handleChange = (e , x) => {
          e.preventDefault();
          if(e.target.files[0].type == 'image/png' || e.target.files[0].type  == 'image/jpeg' ){
                  console.log(e.target.files[0])
                  setFile(e.target.files[0])
                  const storageRef = projectStorage.ref(`ProfilePics/${userInfo._id}/${e.target.files[0].name}`);
                  storageRef.put(e.target.files[0]).on('state_changed', (snap) => {
                  let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                  setProgress(percentage);
                  }, (err) => {
                  setError(err);
                  }, async () => {
                  const url = await storageRef.getDownloadURL();
                  setProfilePic(url)
                  setProgress(0);
                  axios.put(`/api/users/profilepic` , {profilePic : url} ,{ headers: { Authorization: `Bearer ${userInfo.token}`} }  )
                  .then(res => { if(res.data){ enqueueSnackbar( 'Successfully Updated!' , { variant: 'success' });  }})

                  return;
                  })
          }
          
  };


        useEffect(() => {
                
                if (!userInfo) { router.push('/login') ; return; }

                axios.get(`/api/users/` ,  { headers: { Authorization: `Bearer ${userInfo.token}`} }  )
                .then(res => { if(res.data){ 

                        setName(res.data.name)
                        setEmail(res.data.email) 
                
                        setfullName(res.data.fullName)
                        setfb(res.data.fb)
                        setinsta(res.data.insta)
                        setgithub(res.data.github)
                        setupwork(res.data.upwork)
                        setfreelancer(res.data.freelancer)
                        setcontact(res.data.contact)
                        setsmallBio(res.data.smallBio)
                        setbigBio(res.data.bigBio)
                        setTimeSpent(res.data.timeSpent.reverse())
                        setProfilePic(res.data.profilePic)
                        setMessages(res.data.messages.reverse())
                        
                        
                
                }})


              }, [userInfo]);


              const submitHandler = async (e) => {
                e.preventDefault();
                closeSnackbar();
                try {
                  const { data } = await axios.put('/api/users/update-profile', {
                    name,
                    email,
                    password,
                    fullName,
                    fb ,
                    insta ,
                    github ,
                    upwork ,
                    freelancer,
                    contact ,
                    smallBio,
                    bigBio ,
                    password
                  } , { headers: { Authorization: `Bearer ${userInfo.token}`} } );

                  enqueueSnackbar( 'Successfully Updated!' , { variant: 'success' });
                  setPassword('')

                } catch (err) {
                  enqueueSnackbar(getError(err), { variant: 'error' });
      
                }
              };


        return (
                <div>
                <Layout>
                <Container>
                <Grid container spacing={0}>

                
                <Grid item md={5} style={{height:'500px',width:'100%'}} >
                <Container>
                <div style={{margin :'auto' , width:'350px',height:'350px',textAlign:'center',borderRadius:'50%',overflow:'hidden'}} >
                      <img style={{margin :'auto',textAlign:'center',width:'100%'}} src={profilePic} />

                </div>
                <input type="file" className="filee" onChange={handleChange} ></input>
                <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
                </Box>
                </Container>
                </Grid>
                
                
                <Grid item md={7} style={{width:'100%'}} >
                <form onSubmit={submitHandler} className={classes.form}>
              <Typography component="h1" variant="h1">
                Update
              </Typography>
              <List>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Name"
                    value={name}
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setName(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    value={email}
                    label="Email"
                    inputProps={{ type: 'email' }}
                    onChange={(e) => setEmail(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Password"
                    inputProps={{ type: 'password' }}
                    onChange={(e) => setPassword(e.target.value)}
                  ></TextField>
                </ListItem>

                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPfghassword"
                    value={github}
                    label="Github Account"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setgithub(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={contact}
                    id="confirmPassfhghword"
                    label="Contact Number"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setcontact(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={smallBio}
                    label="Brief Introduction"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setsmallBio(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={bigBio}
                    label="Bio"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setbigBio(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button variant="contained" type="submit"  color="primary">
                    Update
                  </Button>
                </ListItem>
              </List>
            </form>
                </Grid>

                </Grid>


                <br/>
                <Card>
                <Container>
                  <Typography variant='h1'>Time Spent</Typography><br/>
                  {TimeSpent.map(x => <Typography variant='h2'>
                  {x.dateVisited} : {x.visitor.length} {' people spent '} {convertor(x.seconds)}
                  </Typography>)}
                </Container>
                </Card>

                <br/><br/><br/>

                <Card>
                <Container>
                  <Typography variant='h1'>Messages</Typography><br/>
                  {Messages.map(x => <Typography variant='h2'> 

                  <Typography variant='h2'>
                    <a href={`mailto:${x.email}`} target="_blank">{x.email}</a>
                    <span style={{marginLeft:'40px',fontSize:'15px',color:'lightgrey'}} >{' at '}{x.at.split('T')[0].split('-').reverse().join(' ')} </span>

                  </Typography>
                  <p style={{fontSize:'20px',fontFamily:'Roboto',marginBottom:'60px'}} >{x.message}</p>
                  </Typography>)}
                </Container>
                </Card>

                </Container>
                </Layout>
                        
                </div>
        )
}


export default dynamic(() => Promise.resolve(Admin), { ssr: false });
