import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {stringToMicroAlgos} from "../../utils/conversions";

const AddShoe = ({createShoes}) => {
    const [brand, setBrand] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
    const [availableShoes, setAvailableShoes] = useState(1);

    const isFormFilled = useCallback(() => {
        return brand && image && description && location && price && availableShoes > 0
    }, [brand, image, description, location, price, availableShoes]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{width: "38px"}}
            >
                <i className="bi bi-plus"></i>
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add new Shoe</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputBrand"
                            label="Shoe brand"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setBrand(e.target.value);
                                }}
                                placeholder="Enter brand name"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputUrl"
                            label="Image URL"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Image URL"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputDescription"
                            label="Description"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="description"
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="inputLOCATION"
                            label="location"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Location"
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputPrice"
                            label="Price in ALGO"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Price"
                                onChange={(e) => {
                                    setPrice(stringToMicroAlgos(e.target.value));
                                }}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="inputAvailable"
                            label="available"
                            className="mb-3"
                        >
                            <Form.Control
                                type="number"
                                value={availableShoes}
                                placeholder="Available shoes"
                                onChange={(e) => {
                                    setAvailableShoes(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                </Form>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="dark"
                        disabled={!isFormFilled()}
                        onClick={() => {
                            createShoes({
                                brand,
                                image,
                                description,
                                location,
                                price,
                                availableShoes,
                            });
                            handleClose();
                        }}
                    >
                        Save Shoe
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddShoe.propTypes = {
    createShoes: PropTypes.func.isRequired,
};

export default AddShoe;
