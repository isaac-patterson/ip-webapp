import React, { useState, useEffect, Fragment } from 'react';
import { Auth } from "aws-amplify"
import axios from 'axios';

import { useGetSession } from '../UtilityHooks/AuthHooks';
import { snackBarMessages } from '../../constants/UIStringConstants';

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import DeleteIcon from '@mui/icons-material/Delete';
import { BiteButton } from '../../components/BiteButton';

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
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
))

const EditCouponsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [successSnackBar, setSuccessSnackBar] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState({ show: false, text: snackBarMessages.CHANGES_NOT_SAVED })

    const [cognitoId, setCognitoId] = useState<string>("")

    useEffect(() => {
        getCouponData()

        async function fetchCognitoID() {
            return await Auth.currentSession().then(data => { setCognitoId(data.getIdToken().payload.sub) })
        }
        fetchCognitoID()
    },
        []) // eslint-disable-line react-hooks/exhaustive-deps

    const classes = useStyles()
    const getSession = useGetSession()

    const [isEditing, setisEditing] = useState<boolean>(false)
    const [coupons, setCoupons] = useState<any[]>([])

    const deleteCoupon = async (coupon) => {
        setIsLoading(true)

        const jwtToken = await getSession(false)
        const url = `https://biteapp.work/retail/api/coupon/deletecoupon`
        const body = coupon

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
                getCouponData()
            })
            .catch(error => {
                console.log(error)

                setFailureSnackBar({
                    show: true,
                    text: snackBarMessages.CHANGES_NOT_UPDATED
                })
            })

        setIsLoading(false)
    };


    const updateCoupons = async () => {
        setIsLoading(true)

        const jwtToken = await getSession(false)
        const url = `https://biteapp.work/retail/api/coupon/savecoupons`
        const body = coupons

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
                getCouponData()
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
    };

    const getCouponData = async () => {
        setIsLoading(true)

        const { cognitoId, jwtToken } = await getSession(true)
        const getOrdersUrl = `https://biteapp.work/retail/api/coupon/get/${cognitoId}`

        await axios.get(getOrdersUrl, { headers: { AUTHORIZATION: "Bearer " + jwtToken } })
            .then(res => {
                setCoupons(res.data.data)
            })
            .catch(error => console.log(error))

        setIsLoading(false)
    };

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
                onClose={() => setFailureSnackBar({
                    show: !failureSnackBar.show,
                    text: ""
                })}
                autoHideDuration={10000}
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
                <Grid container spacing={3} direction="column" className={classes.GridContainer} >
                    <Grid item >
                        <Grid container spacing={3} justifyContent="space-between" direction="row" className={classes.GridContainer} >
                            <Grid item >
                                <Typography variant="h4" gutterBottom>
                                    Store coupons
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Users can enter a Coupon Code to get a discount on their order
                                </Typography>
                            </Grid>
                            <Grid item >
                                <BiteButton
                                    variant="contained"
                                    onClick={() => {
                                        if (isEditing) updateCoupons()
                                        setisEditing(!isEditing)
                                    }}
                                >
                                    {isEditing ? "Save" : "Edit"}
                                </BiteButton>
                            </Grid>
                        </Grid>
                    </Grid>


                    {coupons.map((coupon, index) => {
                        return (
                            <Grid item key={index} >
                                <Grid container spacing={3} direction="row" className={classes.GridContainer} >
                                    <Grid item >
                                        <TextField
                                            disabled={!isEditing}
                                            label="Coupon Code"
                                            variant="outlined"
                                            value={coupon.discountCode}
                                            onChange={
                                                (discountCode) => {
                                                    const newCoupons = [...coupons]
                                                    newCoupons[index].discountCode = discountCode.target.value
                                                    setCoupons(newCoupons)
                                                }
                                            }
                                        />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            disabled={!isEditing}
                                            label="Decimal discount"
                                            variant="outlined"
                                            value={coupon.discount}
                                            onChange={(discountValue) => {
                                                const newCoupons = [...coupons]
                                                newCoupons[index].discount = discountValue.target.value
                                                setCoupons(newCoupons)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            disabled={!isEditing}
                                            id="datetime-local"
                                            label="Valid untill"
                                            type="datetime-local"
                                            InputLabelProps={{ shrink: true }}
                                            value={coupon.expiryDate}
                                            onChange={(expiryDate) => {
                                                const newCoupons = [...coupons]
                                                newCoupons[index].expiryDate = expiryDate.target.value
                                                setCoupons(newCoupons)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <IconButton 
                                            disabled={!isEditing}
                                            onClick={() => deleteCoupon(coupons[index])}
                                            >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>

                                </Grid>
                            </Grid>
                        )
                    })}

                    <Grid item >
                        <BiteButton
                            disabled={!isEditing}
                            variant="contained"
                            onClick={() => setCoupons([...coupons, {
                                couponId: null,
                                createdDate: null,
                                discount: 0,
                                discountCode: "",
                                expiryDate: null,
                                restaurantId: cognitoId,
                                userDeleted: false
                            }
                            ])}
                        >
                            Add new coupon
                        </BiteButton>
                    </Grid>
                </Grid>
            </div>
        </div>

    );
}

export default EditCouponsPage;
