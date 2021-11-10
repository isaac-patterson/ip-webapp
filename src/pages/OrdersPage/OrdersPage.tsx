import React, { useState, useEffect, useRef, Fragment } from 'react';
import axios from 'axios';
import { useGetSession } from '../UtilityHooks/AuthHooks';

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from "@mui/icons-material/DoneAll"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Box from "@mui/material/Box"

import { snackBarMessages } from '../../constants/UIStringConstants';
import { BiteButton } from '../../components/BiteButton';
import { BiteSlider } from '../../components/BiteSlider';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            width: '100%',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
        },
        GridContainer: {
            width: '100%',
            flexGrow: 1,
        },
        GridItem: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        OrderListColumn: {
            width: '50%',
        },
        OrderGridItem: {
            padding: "8",
        },
        ListItem: {
            margin: "5px 0",
            backgroundColor: "#d7d7d7",
            "&:hover": {
                backgroundColor: "#b7b7b8",
                color: "white"
            }
        },
        ListItemText: {
            color: "#4D4A49",
        },
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ModalContent: {
            width: '80%',
            height: '50%',
        },
        ModalButton: {
            width: '80%',
        },
    })
))

const OrdersPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isModelOpen, setIsModalOpen] = useState<boolean>(false)
    const [successSnackBar, setSuccessSnackBar] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)

    const TWENTY_SEC = 20000;
    const THREE_SEC = 3000

    const classes = useStyles();
    const getSession = useGetSession()

    const [pendingOrders, setPendingOrders] = useState<any[]>([])
    const [confirmedOrders, setConfirmedOrders] = useState<any[]>([])

    const [orderTime, setOrderTime] = useState<number>(3)
    const [selectedOrder, setSelectedOrder] = useState({})

    const audio = new Audio("/notification_sound.mp3")
    const pendingOrdersRef = useRef(pendingOrders) //because of js closure
    pendingOrdersRef.current = pendingOrders //want pending confirmedOrders to always be current inside the interva;

    useEffect(() => {
        getPendingOrders()
        getConfirmedOrders()

        const getOrdersInterval = setInterval(() => {
            getPendingOrders()
        }, TWENTY_SEC);

        const dingInterval = setInterval(() => {
            if (pendingOrdersRef.current.length !== 0) {
                audio.play()
            }
        }, THREE_SEC)

        return () => {
            clearInterval(getOrdersInterval)
            clearInterval(dingInterval)
        };
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getPendingOrders = async () => {
        const { cognitoId, jwtToken } = await getSession(true)
        const url = `https://biteapp.work/retail/api/order/getpending/${cognitoId}`

        await axios.get(url, { headers: { AUTHORIZATION: `Bearer ${jwtToken}` } })
            .then(res => {
                console.log(res.data.data)
                setPendingOrders(res.data.data)
            })
            .catch(error => console.log(error))

        setIsLoading(false)
    };

    const getConfirmedOrders = async () => {
        const { cognitoId, jwtToken } = await getSession(true)
        const url = `https://biteapp.work/retail/api/order/getconfirmed/${cognitoId}`

        await axios.get(url, { headers: { AUTHORIZATION: `Bearer ${jwtToken}` } })
            .then(res => {
                setConfirmedOrders(res.data.data)
            })
            .catch(error => console.log(error))
    };

    const handleConfirmOrderClick = async (order) => {
        setIsLoading(true)

        const jwtToken = await getSession(false)
        const url = `https://biteapp.work/retail/api/order/orderStatusConfirmed/${order.orderId}/${new Date().toISOString()}`

        await axios.patch(url, {}, { headers: { AUTHORIZATION: `Bearer ${jwtToken}` } })
            .then(res => {
                setSuccessSnackBar(true)
            })
            .catch(error => {
                console.log(error)
                setFailureSnackBar(true)
            })

        await getPendingOrders()
        await getConfirmedOrders()
        setIsModalOpen(false)
        setIsLoading(false)
    }

    const handleConfirmedOrderClick = async (order) => {
        setIsLoading(true)
        const pickupTime = new Date();
        pickupTime.setMinutes(pickupTime.getMinutes() + orderTime);

        const jwtToken = await getSession(false)
        const url = `https://biteapp.work/retail/api/order/OrderStatusPickedUp/${order.orderId}/${pickupTime.toISOString()}`

        await axios.patch(url, {}, { headers: { AUTHORIZATION: `Bearer ${jwtToken}` } })
            .then(res => {
                setSuccessSnackBar(true)
            })
            .catch(error => {
                console.log(error)
                setFailureSnackBar(true)
            })

        await getConfirmedOrders()
        setIsLoading(false)
    }

    const formatOrderListItem = (order, listType, classes) => {
        const orderTime = new Date(order.createdDate)
        const pickupDate = new Date(order.pickupDate) //USER SET PICKUP DATE, ACCEPT NOTE.

        return (
            <Grid item key={orderTime.toString()} className={classes.OrderGridItem} >
                <Grid container direction="row" >
                    <Grid item xs={4} container>
                        <Typography variant="h6" gutterBottom>
                            {order.pickupName} - ${order.total}
                        </Typography>


                        {(listType === "pendingOrdersList") ?
                            <Typography variant="subtitle2" gutterBottom>
                                Ordered at {orderTime.getHours()}:{orderTime.getUTCMinutes()}
                            </Typography>
                            :
                            <Typography variant="subtitle2" gutterBottom>
                                Due at {pickupDate.getHours()}:{pickupDate.getUTCMinutes()}
                            </Typography>
                        }

                    </Grid>

                    <Grid item xs={4}>
                        {/* Intentionally Empty */}
                    </Grid>

                    <Grid item container xs={4} justifyContent="flex-end">
                        {(listType === "pendingOrdersList") ?
                            <IconButton edge="end" aria-label="delete" onClick={() => {
                                setIsModalOpen(true)
                                setSelectedOrder(order)
                            }}>
                                <CheckIcon />
                            </IconButton> :
                            <IconButton edge="end" aria-label="delete" onClick={() => { handleConfirmedOrderClick(order) }}>
                                <DoneAllIcon />
                            </IconButton>
                        }
                    </Grid>
                </Grid>

                <List>
                    {order.orderItem.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <ListItem role={undefined} dense className={classes.ListItem}>
                                    <ListItemText className={classes.ListItemText}
                                        primary={item.name}
                                        secondary={
                                            item.orderItemOption.map((itemOption) => {
                                                return (
                                                    `${itemOption.name.toUpperCase()}: ${itemOption.value}`
                                                )
                                            }).join(" ")
                                        }
                                    />
                                </ListItem>
                            </React.Fragment>
                        )
                    })
                    }
                </List>

                <Divider />
                <Divider />
                <Divider />
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
                    message={snackBarMessages.ORDER_UPDATED}
                />
            </Snackbar>

            <Snackbar
                open={failureSnackBar}
                onClose={() => setFailureSnackBar(!failureSnackBar)}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#e84141' }}
                    message={snackBarMessages.ORDER_NOT_UPDATED}
                />
            </Snackbar>
        </Fragment>
    )

    return (
        <div>
            {popups}

            <div className={classes.root}>
                <Grid container className={classes.GridContainer} alignItems="stretch" spacing={2}>
                    <Grid item className={classes.OrderListColumn}>
                        <h2>Order Requests</h2>
                        <Grid container spacing={2} direction="column">
                            {pendingOrders.map((order) => {
                                return (formatOrderListItem(order, "pendingOrdersList", classes))
                            })}
                        </Grid>
                    </Grid>
                    <Grid item className={classes.OrderListColumn}>
                        <h2>Awaiting Pickup</h2>
                        <Grid container spacing={2} direction="column">
                            {confirmedOrders.map((order) => {
                                return (formatOrderListItem(order, "currentOrdersList", classes))
                            })}
                        </Grid>
                    </Grid>
                </Grid>

                <Modal
                    open={isModelOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.Modal}
                >
                    <Paper elevation={6} square className={classes.ModalContent}>
                        <Grid container alignItems="center" direction="column" justifyContent="center" spacing={2} className={classes.Modal}>
                            <Grid item >
                                <Typography variant="h6" gutterBottom>
                                    Time to make:
                                </Typography>
                            </Grid>

                            <Grid item >
                                <Box width={300}>
                                    <BiteSlider
                                        defaultValue={10}
                                        value={orderTime}
                                        onChange={(event: any, newValue: number | number[]) => { setOrderTime(newValue as number) }}
                                        aria-labelledby="continuous-slider"
                                        min={2}
                                        max={90}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                            </Grid>

                            <Grid item >
                                <Typography variant="h1" gutterBottom>
                                    {orderTime} minutes
                                </Typography>
                            </Grid>

                            <Grid item >
                                <BiteButton
                                    variant="contained"
                                    onClick={() => handleConfirmOrderClick(selectedOrder)}
                                    className={classes.ModalButton}
                                >
                                    Confirm Order
                                </BiteButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Modal>
            </div>
        </div >
    );
}

export default OrdersPage;
