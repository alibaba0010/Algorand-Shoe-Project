import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddCar from "./AddCar";
import Car from "./Car";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyCarAction, createCarAction, addmoreCarsAction, changelocationAction,  deleteCarAction, getCarsAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Cars = ({address, fetchBalance}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCars = async () => {
        setLoading(true);
        getCarsAction()
            .then(cars => {
                if (cars) {
                    setCars(cars);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getCars();
    }, []);

    const createCar = async (data) => {
        setLoading(true);
        createCarAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Car added successfully."/>);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to add caar."/>);
                setLoading(false);
            })
    };


    const addCar = async (car, ammount) => {
        setLoading(true);
        addmoreCarsAction(address, car, ammount)
            .then(() => {
                toast(<NotificationSuccess text="Car added"/>);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to add car."/>);
                setLoading(false);
            })
    };


    const changeLocation = async (car, location) => {
        setLoading(true);
        changelocationAction(address, car, location)
            .then(() => {
                toast(<NotificationSuccess text="location changed successfully"/>);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed change location."/>);
                setLoading(false);
            })
    };



    const buyCar = async (car) => {
        setLoading(true);
        buyCarAction(address, car)
            .then(() => {
                toast(<NotificationSuccess text="Car bought successfully"/>);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to buy car."/>);
                setLoading(false);
            })
    };

    const deleteCar = async (car) => {
        setLoading(true);
        deleteCarAction(address, car.appId)
            .then(() => {
                toast(<NotificationSuccess text="Car deleted successfully"/>);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete car."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Rider dapp</h1>
                <AddCar createCar={createCar}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {cars.map((data, index) => (
                        <Car
                            address={address}
                            car={data}
                            buyCar={buyCar}
                            changeLocation = {changeLocation}
                            addCar = {addCar}
                    
                            deleteCar={deleteCar}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Cars.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Cars;
