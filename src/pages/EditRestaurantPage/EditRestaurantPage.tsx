import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import axios from 'axios';

import { snackBarMessages } from '../../constants/UIStringConstants';
import { useGetSession } from '../UtilityHooks/AuthHooks';

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BiteButton } from '../../components/BiteButton';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            width: '100%',
            backgroundColor: '#FFFFFF',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        },
        GridContainer: {
            width: '100%',
            margin: "8px"
        },
        DateGridContainer: {
            width: '45%',
            margin: "8px"
        },
        formControl: {
            margin: 1,
            minWidth: 300,
        },
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

    })
))

const EditRestaurantPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [successSnackBar, setSuccessSnackBar] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState({ show: false, text: snackBarMessages.CHANGES_NOT_SAVED })

    useEffect(() => {
        getRestaurantData()
    },
        []) // eslint-disable-line react-hooks/exhaustive-deps

    const classes = useStyles()
    const getSession = useGetSession()

    const [isEditing, setisEditing] = useState<boolean>(false)
    const [restaurant, setRestaurant] = useState({
        restaurantId: "",
        createdDate: "",
        name: "",
        description: "",
        countryCode: "",
        address: "",
        category: "",
        logoIcon: "",
        offer: "",
        restaurantOpenDays: [{
            restaurantId: "",
            createdDate: "",
            day: "",
            openTime: "",
            closeTime: "",
            isOpen: false
        }]
    })

    const getRestaurantData = async () => {
        setIsLoading(true)

        const { cognitoId, jwtToken } = await getSession(true)
        const url = `https://biteapp.work/retail/api/restaurant/getById/${cognitoId}`

        await axios.get(url, { headers: { AUTHORIZATION: "Bearer " + jwtToken } })
            .then(res => setRestaurant(res.data.data))
            .catch(error => console.log(error))

        setIsLoading(false)
    };

    const updateRestaurantData = async () => {
        setIsLoading(true)

        const jwtToken = await getSession(false)
        const url = `https://biteapp.work/retail/api/restaurant/update`
        const body = { ...restaurant }

        await axios.post(
            url,
            body,
            {
                headers: {
                    AUTHORIZATION: "Bearer " + jwtToken,
                    "ContentType": "application/JSON"
                }
            }
        )
            .then(res => {
                setSuccessSnackBar(true)
                getRestaurantData()
            })
            .catch(error => {
                console.log(error)
                let errors = error.response.data.errors &&
                    Object.values(error.response.data.errors)
                        .map((validationError) => validationError)

                errors = [].concat.apply([], errors).join("\n") //flatten
                const errorText = snackBarMessages.CHANGES_NOT_SAVED + "\n" + errors

                setFailureSnackBar({
                    show: true,
                    text: errorText
                })
            })

        setIsLoading(false)
    }

    const WeekdayCard = (dayOfWeek, index) => {
        return (
            <Grid container justifyContent="space-between" key={index} spacing={3} direction="row" className={classes.DateGridContainer}>
                <Grid item >
                    <FormControlLabel
                        value="top"
                        control={
                            <Checkbox
                                disabled={!isEditing}
                                checked={dayOfWeek.isOpen}
                                value={dayOfWeek.isOpen}
                                onChange={() => {
                                    let restaurantNew = { ...restaurant }
                                    restaurantNew.restaurantOpenDays[index].isOpen = !dayOfWeek.isOpen
                                    setRestaurant(restaurantNew)
                                }}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label={dayOfWeek.day}
                        labelPlacement="end"
                    />
                </Grid>

                <Grid item >
                    <TextField
                        disabled={!dayOfWeek.isOpen || !isEditing}
                        id="time"
                        label="Open time"
                        type="time"
                        value={dayOfWeek.openTime}
                        InputLabelProps={{ shrink: true }}
                        onChange={(openTime) => {
                            let newRestaurant = { ...restaurant }
                            newRestaurant.restaurantOpenDays[index].openTime = openTime.target.value
                            setRestaurant(newRestaurant)
                        }}
                    />

                    <TextField
                        disabled={!dayOfWeek.isOpen || !isEditing}
                        id="time"
                        label="Close time"
                        type="time"
                        value={dayOfWeek.closeTime}
                        InputLabelProps={{ shrink: true }}
                        onChange={(closeTime) => {
                            let newRestaurant = { ...restaurant }
                            newRestaurant.restaurantOpenDays[index].closeTime = closeTime.target.value
                            setRestaurant(newRestaurant)
                        }}
                    />
                </Grid>
            </Grid>
        )
    }

    const popups = (
        <Fragment>
            <Modal
                open={isLoading}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.Modal}
            >
                <BiteCircularProgress size={150} />
            </Modal>

            <Snackbar
                open={successSnackBar}
                onClose={() => setSuccessSnackBar(!successSnackBar)}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#56c244' }}
                    message={snackBarMessages.CHANGES_SAVED}
                />
            </Snackbar>

            <Snackbar
                open={failureSnackBar.show}
                onClose={
                    () => setFailureSnackBar({
                        show: !failureSnackBar.show,
                        text: ""
                    })
                }
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#e84141', whiteSpace: "pre-line" }}
                    message={failureSnackBar.text}
                />
            </Snackbar>
        </Fragment>
    )

    return (
        <div>
            {popups}

            <div className={classes.root}>
                <Grid container spacing={3} justifyContent="space-between" direction="row" className={classes.GridContainer} >
                    <Grid item >
                        <Typography variant="h4" gutterBottom>
                            Edit your restaurant details
                        </Typography>
                    </Grid>
                    <Grid item >
                        <BiteButton
                            variant="contained"
                            onClick={() => {
                                if (isEditing) {
                                    updateRestaurantData()
                                }
                                setisEditing(!isEditing)
                            }}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </BiteButton>
                    </Grid>
                </Grid>

                <Grid container spacing={3} direction="column" className={classes.GridContainer} >
                    <Grid item >
                        <Typography variant="h6" gutterBottom>
                            Details
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Information about your restaurant that app users see when deciding which restaurant to order from
                        </Typography>
                    </Grid>

                    <Grid item >
                        <TextField
                            disabled={!isEditing}
                            id="outlined-required"
                            label="Restaurant name"
                            variant="outlined"
                            error={restaurant.name.length > 50 ? true : false}
                            helperText="50 Letters max"
                            value={restaurant.name}
                            onChange={(name) => {
                                setRestaurant({
                                    ...restaurant,
                                    name: name.target.value
                                })
                            }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            disabled={!isEditing}
                            id="restaurant-icon"
                            label="Restaurant icon"
                            variant="outlined"
                            value={`${restaurant.logoIcon}`}
                            onChange={(logoIcon) => {
                                setRestaurant({
                                    ...restaurant,
                                    logoIcon: logoIcon.target.value
                                })
                            }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            disabled={!isEditing}
                            multiline
                            id="restaurant-description"
                            label="Restaurant description"
                            variant="outlined"
                            fullWidth
                            value={restaurant.description}
                            onChange={(description) => {
                                setRestaurant({
                                    ...restaurant,
                                    description: description.target.value
                                })
                            }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            disabled={!isEditing}
                            id="restaurant-adress"
                            label="Resaurant address"
                            variant="outlined"
                            fullWidth
                            value={restaurant.address}
                            onChange={(address) => {
                                setRestaurant({
                                    ...restaurant,
                                    address: address.target.value
                                })
                            }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            id="restaurant-category"
                            disabled={!isEditing}
                            label="Resaurant Category"
                            variant="outlined"
                            value={restaurant.category}
                            onChange={(category) => {
                                setRestaurant({
                                    ...restaurant,
                                    category: category.target.value
                                })
                            }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            id="restaurant-offer"
                            disabled={!isEditing}
                            label="Store wide discount"
                            variant="outlined"
                            value={restaurant.offer}
                            onChange={(offer) => {
                                setRestaurant({
                                    ...restaurant,
                                    offer: offer.target.value
                                })
                            }}
                        />
                    </Grid>

                </Grid>

                <Grid container spacing={3} direction="column" className={classes.GridContainer} >
                    <Grid item >
                        <Typography variant="h6" gutterBottom>
                            Opening times
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            The days and times in which app users will be able to order from your restaurant
                        </Typography>
                    </Grid>

                    <Grid container direction="column" >
                        {restaurant.restaurantOpenDays.map((day, index) => {
                            return WeekdayCard(day, index)
                        })}
                    </Grid>
                </Grid>
            </div>

        </div>

    );
}

export default EditRestaurantPage;
