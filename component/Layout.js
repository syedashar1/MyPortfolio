import React , { useContext , useEffect } from 'react';
import Head from 'next/head';
import { AppBar, Toolbar, Typography, Container ,InputBase, Box , IconButton, Drawer, List, ListItem, Divider, ListItemText ,Button,Menu,MenuItem, Switch ,Link ,createTheme , ThemeProvider, CssBaseline ,Badge} from '@material-ui/core';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import shortid from 'shortid'

export default function Layout({ title, description, children , sec }) {

  const { state, dispatch } = useContext(Store);
  const { darkMode, userInfo  } = state;
  const router = useRouter();
  


  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    console.log(sec);
  }, [sec])

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };



  useEffect(() => {

    if(userInfo){
      Cookies.remove('visitor');
    }
    if(!userInfo && !Cookies.get('visitor') ){
      Cookies.set('visitor', JSON.stringify(shortid.generate()));
    }


  }, [userInfo])



  const [time, setTime] = useState({ seconds: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    if (redirect) {
      router.push(redirect);
    }
    setAnchorEl(null);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);

    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };


  const classes = useStyles();
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },

      success : {
        main :'#e6dace'
      }

    },
  });


  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };


  useEffect(() => {

    if(userInfo) return ;


    try {
      let isCancelled = false;
    const advanceTime = () => {
      setTimeout(() => { let nSeconds = time.seconds; nSeconds++; console.log(nSeconds);
        if (nSeconds > 14) {

          let realDate = new Date().toString().split(' ') ;
          realDate.length = 4 ;
          realDate = realDate.join(' ')

          axios.put('/api/admin/timer', {
            timeToAdd : nSeconds , 
            visitor : JSON.parse(Cookies.get('visitor')) , 
            dateVisited : realDate
          })

          
          nSeconds = 0;
        }
        !isCancelled && setTime({seconds: nSeconds});
      }, 1000); };
    advanceTime();
    return () => { isCancelled = true };
    } catch (error) {
      console.log(error);
    }

    
  }, [time , userInfo]);
 



  return (
    <div>
      <Head>
      <title>{title ? `${title} - Ashar's Portfolio` : `Ashar's Portfolio`}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
      <AppBar position="static" className={classes.navbar}>
      <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">

              {/* <Button variant="contained" className={classes.newColor} >Contained</Button> */}
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>My Resume</Typography>
                </Link>
              </NextLink>
            </Box>
            
          <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>

            {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                    style={{borderRadius:'50%',margin:'0px 10px'}}
                  >
                    <div style={{width:'50px',height:'50px',textAlign:'center',borderRadius:'50%',overflow:'hidden'}} >
                      <img src={userInfo.profilePic} alt='a pic' style={{width:'100%'}} ></img>
                    </div>
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}>
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/admin')}
                    >
                      Admin
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/newproject')
                      }
                    >
                      Create
                    </MenuItem>
                    
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                  <Link>
                    <Typography component="span">
                    <a href='#Contact' >Contact</a>
                    </Typography>
                  </Link>
              )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.main}>{children}</div>
      <footer className={classes.footer}>
        <Typography >All rights reserved. Built on NextJs.</Typography>
      </footer>
      </ThemeProvider>
    </div>
  );
}