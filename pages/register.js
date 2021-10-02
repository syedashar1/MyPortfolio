import {
        List,
        ListItem,
        Typography,
        TextField,
        Button,
        Link,
      } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../component/Layout';
import { Store } from '../utils/store';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';


export default function Register() {
        const router = useRouter();
        const { redirect } = router.query;
        const { state, dispatch } = useContext(Store);
        const { userInfo } = state;
        useEffect(() => {
          if (userInfo) {
            router.push('/');
          }
        }, []);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
      
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






        const classes = useStyles();
        const submitHandler = async (e) => {
          e.preventDefault(); 
          closeSnackbar();

          if (password !== confirmPassword) {
            enqueueSnackbar("Passwords don't match", { variant: 'error' });
            return;
          }
          try {
            const { data } = await axios.post('/api/users/register', {
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
            });
            dispatch({ type: 'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
          } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });

          }
        }; 
        return (
          <Layout title="Register">
            <form onSubmit={submitHandler} className={classes.form}>
              <Typography component="h1" variant="h1">
                Register
              </Typography>
              <List>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Name"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setName(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
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
                    id="confirmPassword"
                    label="Confirm Password"
                    inputProps={{ type: 'password' }}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></TextField>
                </ListItem>

                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="confirmPfghassword"
                    label="Github Account"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setgithub(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
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
                    label="Bio"
                    inputProps={{ type: 'text' }}
                    onChange={(e) => setbigBio(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button variant="contained" type="submit" fullWidth color="primary">
                    Register
                  </Button>
                </ListItem>
                <ListItem>
                  Already have an account? &nbsp;
                  <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                    <Link>Login</Link>
                  </NextLink>
                </ListItem>
              </List>
            </form>
          </Layout>
        );
      }