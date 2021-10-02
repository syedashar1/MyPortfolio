import Head from 'next/head'
import Image from 'next/image'
import Layout from '../component/Layout'
import styles from '../styles/Home.module.css'
import {Grid,Card,CardActionArea,CardMedia,CardContent, List , ListItem ,TextField ,Chip ,Container,Typography,CardActions,Button,Link} from '@material-ui/core';
import NextLink from 'next/link';
import db from '../utils/db';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/store';
import axios from 'axios';
import Fade from 'react-reveal/Fade';
import { useRouter } from 'next/router';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import InstagramIcon from '@material-ui/icons/Instagram';
import EmailIcon from '@material-ui/icons/Email';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import SearchIcon from '@material-ui/icons/Search';
import { useSnackbar } from 'notistack';

export default function Home(props) {


  const { products } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  const { darkMode, userInfo  } = state;
  const [User, setUser] = useState(null)
  const [Projects, setProjects] = useState(null)

  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [sec, setSec] = useState(null)
  const [Search, setSearch] = useState('')
  const [Changed, setChanged] = useState(false)
  

  useEffect(() => {
     axios.get('/api/test').then(res=> { if(res.data) {setUser(res.data) ; setSec(res.data.timeSpent.reverse()[0])
       axios.get('/api/test2').then(res=> { if(res.data) setProjects(res.data)  ; setChanged(true)} )
    }} )
  }, [ ])


  const submitHandler = (e) => {
    e.preventDefault()

    console.log('adadasdad');
    if(!email) return ;

    axios.put('/api/message' , {email , message} ).then(res=> { if(res.data) {

    enqueueSnackbar( res.data , { variant: 'success' });
    setMessageSent(true)

   }} )

  }


try {
  useEffect(() => {
    
    try {
      if(Changed && Search.length === 0 ) axios.get('/api/test2').then(res=> { if(res.data) setProjects(res.data)} )
      if(Search.length < 3) return ;
      setProjects(null)
      axios.get(`/api/search/${Search}`).then(res=>{if(res.data) setProjects(res.data) })
    } catch (e) {
      
    }
    

  }, [Search])
} catch (e) {
  
}




  return (

    <Layout title={`Home`} s={ sec || 0 } >
    <Grid container spacing={0} style={{height:'80vh' , backgroundImage: `linear-gradient(75deg, #e6dace 40%, ${darkMode ? '#303030' : 'white'} 20%)` }} >

        {User && User._id ? <div className='main-card'>
        <Grid container spacing={0}>
        <Grid className='card-shadow' item md={5} style={{backgroundColor:'#f4ece6',minHeight:'500px',width:'100%' }} >
        <div style={{margin:'auto',width:'250px',height:'250px',textAlign:'center',borderRadius:'50%',overflow:'hidden' , marginTop:'20px'}} >
                      <img src={User.profilePic} alt='a pic' style={{width:'100%'}} ></img>
        </div>
        <div style={{padding:'0px 40px',textAlign:'center'}}>
        <h1 style={{color:'black'}} >{User.name}</h1>
        <div style={{background:`${darkMode ? '#303030' : 'white'}`,width:'70px',height:'5px',margin:'auto'}} />
        <h3  className='small-bio' >{User.smallBio}</h3>
        </div>
        <div style={{background:`${'white'}` , marginTop:'40px' , textAlign:'center'}} >

         <Button>
         <a href={User.github} target="_blank"><GitHubIcon style={{color:'black' , fontSize:'25px',margin:'5px 0px'}} /></a>
         </Button>

         <Button>
         <a href={`mailto:${User.email}`} target="_blank" ><EmailIcon style={{color:'black' , fontSize:'25px',margin:'5px 0px'}}/></a>
         </Button>

         <Button>
         <a href={User.insta} target="_blank" ><InstagramIcon style={{color:'black' , fontSize:'25px',margin:'5px 0px'}}/></a>
         </Button>

        </div>
        </Grid>
        <Grid item md={7} style={{backgroundColor: darkMode ? '#303030' : 'white', minHeight:'500px' , padding:'20px'}}>
          <Fade right cascade >
          <h1 style={{fontSize:'80px',fontWeight:'900',marginBottom:'20px', marginTop:'20px'}} >Hello</h1>
          </Fade>

          <p style={{whiteSpace:'pre-wrap' , fontFamily:'Roboto' , fontWeight:'400'  } } >{User.bigBio}</p>

      
        <div style={{textAlign:'center',marginTop:'30px'}} >
        <Button variant="contained" size="large" color='primary' style={{backgroundColor:'#e6dace'}} >
          <a href='#Projects' >Projects</a>
          </Button>{' '}
          <Button variant="contained" size="large" color='primary' style={{backgroundColor:'#e6dace'}} >
          <a href='#Skills' >Skills</a>
          </Button>{' '}
          <Button variant="contained" size="large" color='primary' style={{backgroundColor:'#e6dace'}} >
          <a href='#Contact' >Contact</a>
          </Button>
        </div>

        </Grid>
        </Grid>
        </div> : 'Loading' }
      
    </Grid>

    <div style={{height:'80px'}} />
    <div className='gap' />
      
      <Container  id='Projects'>
        <h1 style={{fontSize:'80px',fontWeight:'900',marginBottom:'20px', marginTop:'20px'}} >  
        <div style={{backgroundColor:'#e6dace',width:'20px',height:'60px',display:'inline-block',marginRight:'10px'}} >{' '}</div>
        Projects</h1>
        <div style={{textAlign:'' , margin:'30px' }} >
        <TextField onChange={(e)=>setSearch(e.target.value)} color='secondary' id="standard-basic" label="Browse Framework" size='large' type='text' variant="standard" />
        </div>
        <Grid container spacing={5}>
          {Projects ? Projects.map((x) => (
            
            <Grid item md={6} key={x.name}>
              <Fade bottom cascade>
              <Card>
              <NextLink href={`/project/${x.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={x.mainPic}
                    ></CardMedia>
                    <CardContent>
                      <Typography variant='h1' >{x.title}</Typography>
                      <Typography>{x.smallBio}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <div className='hide' >

                  {x.stack && x.stack.split(' ').map(s=><Chip className={classes.chip} label={s} variant="outlined" />)}
                   
                </div> 
                <div style={{textAlign:'center',padding:'15px',marginTop:'20px'}} >
                  <Button variant='contained' color='primary'  style={{backgroundColor:'#e6dace'}}  >
                    <GitHubIcon style={{marginRight:'10px'}} />{' '} <a href={x.githubLink} target='_blank' >Source Code</a>
                  </Button>
                  </div> 
                  
              </Card></Fade>
            </Grid>
            
          )) :
          
          
          <Container>
          <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </Container>


          }
        </Grid>
      </Container>

      <div style={{height:'120px'}} />



      <Container id='Skills'>
        <h1 style={{fontSize:'80px',fontWeight:'900',marginBottom:'20px', marginTop:'20px'}} >  
        <div style={{backgroundColor:'#e6dace',width:'20px',height:'60px',display:'inline-block',marginRight:'10px'}} >{' '}</div>
        My Skill Stack</h1>

        <Container >
        <Card> 
        <Grid container spacing={2} style={{padding:'20px'}} >
            
            {User && User.skills.split(' ').map(x=><Grid item sm={4} > <h1 > 
          <><div style={{backgroundColor:'#e6dace',width:'20px',height:'20px',borderRadius:'50%',display:'inline-block',marginRight:'10px'}} >{' '}</div>
          <Button>
          <a  style={{fontSize:'40px' , marging:'20px' , padding:'10px' }}
          href={`https://www.google.com/search?q=${x}`} target='_blank' >
          {x}
          </a>
          </Button>
          </>
        </h1> </Grid>)}  
        </Grid>
        </Card>
        </Container> 

        </Container>


        <div style={{height:'120px'}} />

        <Container   id='Contact'>
        <h1 style={{fontSize:'80px',fontWeight:'900',marginBottom:'20px', marginTop:'20px'}} >  
        <div style={{backgroundColor:'#e6dace',width:'20px',height:'60px',display:'inline-block',marginRight:'10px'}} >{' '}</div>
        Contacts</h1>

        {User && <div>


        

        <form className={classes.form} onSubmit={submitHandler}>
        <Card style={{padding:'20px'}} >
        <Typography component="h1" variant="h1"><WhatsAppIcon/>{' '}{'WhatsApp : '}{User.contact}  </Typography>
        <Typography component="h1" variant="h1"><EmailIcon/>{' '}{'Email : '} <a href={`mailto:${User.email}`} target="_blank">{User.email}</a> </Typography><br/>
              {!messageSent ? <>
                <Typography component="h1" variant="h1">
              Or leave a message below:
              </Typography>
              <List>
                <ListItem>
                <TextField onChange={e=>setEmail(e.target.value)} id="standard-basic" label="Email" fullWidth type='email' required variant="standard" />
                </ListItem>
                <ListItem>
                <TextField onChange={e=>setMessage(e.target.value)} id="standard-basic" label='Message' fullWidth multiline rows={6} variant="standard" />
                </ListItem>
                <ListItem>
                <Button variant='contained' size='large' style={{backgroundColor:'#e6dace'}} fullWidth type='submit' color='primary' >Send</Button> 
                </ListItem>
              </List>
              </> : <Typography style={{color:'green'}} component="h1" variant="h1">
              Message Sent !
              </Typography> }
        </Card>
        </form>

        </div>}

        </Container>


       
    
    
    
    
    </Layout>
  )
}