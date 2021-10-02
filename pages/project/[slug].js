import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Grid,Link,List,ListItem,Typography, Card,Button,Container,Chip} from '@material-ui/core';
import Layout from '../../component/Layout';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Project from '../../models/Project';
import axios from 'axios';
import { Store } from '../../utils/store';
import Carousel from 'react-material-ui-carousel';

export default function ProjectScreen(props) {

  const router = useRouter();
  const classes = useStyles();
  const {project} = props
  const { state, dispatch } = useContext(Store);



  if (!project) {
    return <div>Project Not Found</div>;
  }
  return (
    <div>
      <Layout title={project.title} description={project.description}>
      <Container>
      <br/>
      <Carousel interval={3000} timeout={250} navButtonsAlwaysVisible='true' className={classes.carousol} animation="fade">
                {project.images.map((x) => (
                <NextLink key={x} href={`${x}`} passHref>
                <Link> <img src={x} className='carouselpic' /> </Link>
                </NextLink>
                ))}
        </Carousel>

        <br/>
        <Typography component="h1" variant="h1" style={{fontSize:'60px'}} >{project.title}</Typography>
        <Card>
        <Container>
        <Typography component="h2" variant="h2" style={{whiteSpace:'pre-wrap'}} >{project.bigBio}</Typography>
        </Container>
        </Card>


        <br/>
        <Typography component="h1" variant="h1">Skill Stack Used : </Typography>
        <Card>
        <Container>
        <Typography component="h2" variant="h2" style={{whiteSpace:'pre-wrap'}} >
          {project.stack.split(' ').map(x=><Chip label={x} className={classes.chip} variant="outlined" />)}
        </Typography>
        </Container>
        </Card>


        <br/>
        <Card>
        <Container>
        <Typography component="h2" variant="h2" style={{whiteSpace:'pre-wrap'}} >
          Time Span to built this : {project.timeSpan}
        </Typography>
        </Container>
        </Card>

        

      </Container>
        </Layout>
    </div>
  );
}



export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const project = await Project.findOne({slug}).lean();
  await db.disconnect();
  return {
    props: { project: db.convertDocToObj(project) },
  };
}