import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddShoe from "./AddShoes";
import Shoe from "./Shoe";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyShoeAction, createShoeAction, addmoreShoesAction, changelocationAction,  deleteShoeAction, getShoesAction,} from "../../utils/marketplace";//1
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Shoes = ({address, fetchBalance}) => {
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(false);

    const getShoes = async () => {
        setLoading(true);
        getShoesAction()
            .then(shoes => {
                if (shoes) {
                    setShoes(shoes);
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
        getShoes();
    }, []);

    const createShoe = async (data) => {
        setLoading(true);
        createShoeAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Shoes added successfully."/>);
                getShoes();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to add shoes."/>);
                setLoading(false);
            })
    };


    const AddShoes = async (shoe, ammount) => {
        setLoading(true);
        addmoreShoesAction(address, shoe, ammount)
            .then(() => {
                toast(<NotificationSuccess text="Shoes added"/>);
                getShoes();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to add shoes."/>);
                setLoading(false);
            })
    };


    const changeLocation = async (shoe, location) => {
        setLoading(true);
        changelocationAction(address, shoe, location)
            .then(() => {
                toast(<NotificationSuccess text="location changed successfully"/>);
                getShoes();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed change location."/>);
                setLoading(false);
            })
    };



    const buyShoe = async (shoe) => {
        setLoading(true);
        buyShoeAction(address, shoe)
            .then(() => {
                toast(<NotificationSuccess text="Shoes bought successfully"/>);
                getShoes();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to buy shoes."/>);
                setLoading(false);
            })
    };

    const deleteShoe = async (shoe) => {
        setLoading(true);
        deleteShoeAction(address, shoe.appId)
            .then(() => {
                toast(<NotificationSuccess text="Shoes deleted successfully"/>);
                getShoes();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete shoes."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Shoe Store dapp</h1>
                <AddShoe createShoe={createShoe}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {shoes.map((data, index) => (
                        <Shoe
                            address={address}
                            shoe={data}
                            buyShoe={buyShoe}
                            changeLocation = {changeLocation}
                            AddShoes = {AddShoes}
                    
                            deleteShoe={deleteShoe}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Shoes.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Shoes;
