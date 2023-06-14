import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
// import {stringToMicroAlgos} from "../../utils/conversions";

const Shoe = ({address, shoe, buyShoe, deleteShoe, AddShoes, changeLocation,}) => {
    const {brand, image, description, location, price, availableShoes, sold, appId, owner} = shoe;//1

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
                            {availableShoes} Available
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
                       
                        {shoe.owner !== address && availableShoes > 0 ?(
                        <Button
                            variant="outline-dark"
                            onClick={() => buyShoe(shoe)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price)} ALGO
                        </Button>
                        ):(
                            <Card.Text className="flex-grow-1">{shoe.owner!== address? "SOLD OUT": ""}</Card.Text>
                        )
                        }
                        {shoe.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteShoe(shoe)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }

                        </Form>


          
                   {shoe.owner === address &&
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
                                onClick={() => AddShoes(shoe, ammount)}
                                className="btn"
                            >
                                Add more shoe inventory
                            </Button>
                   </Form>
                          
                        }

                   {shoe.owner === address &&
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
                                onClick={() => changeLocation(shoe, newlocation)}
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

Shoe.propTypes = {
    address: PropTypes.string.isRequired,
    shoe: PropTypes.instanceOf(Object).isRequired,
    buyShoe: PropTypes.func.isRequired,
    AddShoes: PropTypes.func.isRequired,
    changeLocation: PropTypes.func.isRequired,//2
    deleteShoe: PropTypes.func.isRequired
};

export default Shoe;
