import React, { useState, useEffect } from 'react';

import { createStyles, makeStyles, ThemeProvider } from '@mui/styles';
import { Theme } from '@mui/material';
import Modal from '@mui/material/Modal';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            backgroundColor: '#FFFFFF',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',

        },
        DataGrid: {
            backgroundColor: '#E0E0E0',
        },
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
));

const PhotosPage: React.FC = () => {
    useEffect(() => {
    }, [])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const classes = useStyles()

    return (
        <div>
            photos
        </div>
    );
}

export default PhotosPage;