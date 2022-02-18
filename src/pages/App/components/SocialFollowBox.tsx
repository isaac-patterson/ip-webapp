import React from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Grid, Theme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        button: {
            cursor: 'pointer',
            '&:hover': {
                color: "#78BDEB",
            },
        }
    })));

const SocialFollowBox: React.FC = () => {
    const classes = useStyles()

    const routeTo = (url) => {
        window.location.replace(url)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <GitHubIcon className={classes.button} onClick={() => { routeTo('https://github.com/isaac-patterson/list-of-projects') }} />
            </Grid>
            <Grid item xs={2}>
                <LinkedInIcon className={classes.button} onClick={() => { routeTo('https://www.linkedin.com/in/isaac-patterson/') }} />
            </Grid>
            <Grid item xs={2}>
                <InstagramIcon className={classes.button} onClick={() => { routeTo('https://www.instagram.com/isaacpat__/') }} />
            </Grid>
        </Grid>
    );
};

export default SocialFollowBox;