import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import {stringToMicroAlgos} from "../../utils/conversions";

const Car = ({address, car, buyCar, deleteCar, addCar, changeLocation,}) => {
    const {brand, image, description, location, price, availableCars, sold, appId, owner} = car;

    const [ammount, setAmmount] = useState("");
    const [newlocation, setNewLocation] = useState("");
   

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner}/>
                        <Badge bg="secondary" className="ms-auto">
                            {availableCars} Available
                        </Badge>

                        <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={brand} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{brand}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    <Card.Text className="flex-grow-1"> Location: {location}</Card.Text>
                    <Form className="d-flex align-content-stretch flex-row gap-2">
                       
                        {car.owner !== address && availableCars > 0 ?(
                        <Button
                            variant="outline-dark"
                            onClick={() => buyCar(car)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price)} ALGO
                        </Button>
                        ):(
                            <Card.Text className="flex-grow-1">{car.owner!== address? "SOLD OUT": ""}</Card.Text>
                        )
                        }
                        {car.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteCar(car)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }

                        </Form>


          
                   {car.owner === address &&
                   <Form>
                    <FloatingLabel
                            controlId="inputAmmount"
                            label="ammount"
                            className="mb-3 mt-4"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Ammount"
                                onChange={(e) => {
                                    setAmmount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>

                        <Button
                                variant="outline-success"
                                onClick={() => addCar(car, ammount)}
                                className="btn"
                            >
                                Add more car inventory
                            </Button>
                   </Form>
                          
                        }

                   {car.owner === address &&
                            <Form>
                                 <FloatingLabel
                            controlId="inputLOCATION"
                            label="location"
                            className="mb-3 mt-4"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Location"
                                onChange={(e) => {
                                    setNewLocation(e.target.value);
                                }}
                            />
                        </FloatingLabel>

                        <Button
                                variant="outline-success"
                                onClick={() => changeLocation(car, newlocation)}
                                className="btn"
                            >
                                change Location
                            </Button>
                        
                            </Form>
                        }


                  
                </Card.Body>
            </Card>
        </Col>
    );
};

Car.propTypes = {
    address: PropTypes.string.isRequired,
    car: PropTypes.instanceOf(Object).isRequired,
    buyCar: PropTypes.func.isRequired,
    addCar: PropTypes.func.isRequired,
    changeLocation: PropTypes.func.isRequired,
    deleteCar: PropTypes.func.isRequired
};

export default Car;
