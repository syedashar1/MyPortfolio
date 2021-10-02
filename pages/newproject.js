import axios from 'axios';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../component/Layout';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';
import { List, ListItem, Typography, TextField, Button, Link , Card ,LinearProgress , Box , Chip} from '@material-ui/core';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { projectStorage } from '../firebase/config';
import Carousel from 'react-material-ui-carousel';
import shortid from 'shortid'

export default function NewProject(props) {
        
        const classes = useStyles();
        const router = useRouter();
        const { state, dispatch } = useContext(Store);
        const { userInfo } = state;
        
        useEffect(() => {
                if (!userInfo) {
                router.push('/login?redirect=/newproject');
                }
        }, []);

        const { enqueueSnackbar, closeSnackbar } = useSnackbar();

        const [File, setFile] = useState(null);
        const [error, setError] = useState(null);
        const [Perc, setPerc] = useState(0)

        const [title, settitle] = useState('')
        const [mainPic, setmainPic] = useState('')
        const [stack1, setstack1] = useState('')
        const [images, setimages] = useState([])
        const [started, setstarted] = useState('')
        const [finished, setfinished] = useState('')
        const [link, setlink] = useState('')
        const [githubLink, setgithubLink] = useState('')
        const [slug, setslug] = useState('')
        const [stackArray, setStackArray] = useState([])
        const [smallBio, setSmallBio] = useState('')
        const [bigBio, setBigBio] = useState('')
        const [timeSpan, setTimeSpan] = useState('')

        const fakeHandler = async (e) => { e.preventDefault()};

        useEffect(() => {
                
                if(stack1) setStackArray(stack1.split(' '))

        }, [stack1])


        const handleChange = (e , x) => {
                e.preventDefault();
                if(e.target.files[0] && e.target.files[0].type == 'image/png' || e.target.files[0].type  == 'image/jpeg' ){
                        console.log(e.target.files[0])
                        setFile(e.target.files[0])
                        const storageRef = projectStorage.ref(`ProjectPics/${userInfo._id}/${shortid.generate()}`);
                        storageRef.put(e.target.files[0]).on('state_changed', (snap) => {
                        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                        setPerc(percentage);
                        }, (err) => {
                        setError(err);
                        }, async () => {
                        const url = await storageRef.getDownloadURL();
                        setPerc(0);
                        console.log(url);
                        if(x == 'main') setmainPic(url)
                        if(x == 'notmain') setimages([...images , url])

                        return;
                        })
                }
                
        };

        const submitHandler = async () => {

                closeSnackbar();
                try {
                  const { data } = await axios.post('/api/project/new', {
                        title,
                        mainPic ,
                        stack : stack1,
                        images ,
                        link ,
                        githubLink ,
                        slug , 
                        bigBio ,
                        smallBio , 
                        timeSpan ,

                  } , { headers: { Authorization: `Bearer ${userInfo.token}`} } );

                  enqueueSnackbar( 'Successfully Created a Project!' , { variant: 'success' });
                  router.push(`/project/${data}`)

                } catch (err) {
                  enqueueSnackbar(getError(err), { variant: 'error' });
      
                }


        }
        



        return (
                <Layout title="Create New Project">
                
                {mainPic && <div style={{height:'400px',width:'100%',textAlign:'center'}} >
                <img src={mainPic} style={{maxHeight:'400px',height:'auto',textAlign:'center'}} />
                </div>
                }


                {images.length > 0 && <Carousel className={classes.carousol} animation="slide">
                {images.map((x) => (
                <NextLink
                key={x}
                href={`${x}`}
                passHref
                >
                <Link>
                <img src={x} style={{maxHeight:'600px',minHeight:'400px'}}/>
                </Link>
                </NextLink>
                ))}
                </Carousel>}


                <form onSubmit={fakeHandler} className={classes.form}>
                <Typography component="h1" variant="h1">Create A New Project</Typography>
                <Card>
                <br/>
                <div style={{textAlign:'center'}} >
                <Button variant="contained" color="primary" component="label"> Add Project Pics
                <input type="file"  hidden className="filee" onChange={(e)=>handleChange(e,'notmain')}/>
                </Button>
                <Button color="primary" component="label"> Upload Main Project
                <input type="file"  hidden className="filee" onChange={(e)=>handleChange(e,'main')}/>
                </Button>
                </div>
                <br/>
                <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={Perc} />
                </Box>
                <List>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={title}
                    label="Enter Title"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => settitle(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={slug}
                    label="Enter a unique Slug"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setslug(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={stack1}
                    label="Enter skill stack"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setstack1(e.target.value)}
                  ></TextField><br/>
                  
                </ListItem>
                <ListItem>
                {stackArray.map(x=><Chip label={x} variant="outlined" />)}
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={smallBio}
                    label="Card Bio" multiline rows={4}
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setSmallBio(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={bigBio}
                    label="Full Bio" multiline rows={12}
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setBigBio(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={timeSpan}
                    label="Set Time Span of completion"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setTimeSpan(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPassword"
                    value={githubLink}
                    label="Github Link"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setgithubLink(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button fullWidth variant="contained" type="submit" onClick={submitHandler} color="primary">
                    Create
                  </Button>
                </ListItem>
                
                </List>
                </Card>
                </form>
                </Layout>
        );
}