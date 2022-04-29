import React from "react";
import $ from 'jquery';

import { v4 as UUID } from "uuid";

import freeTableImg from './pics/freeTable_2.jpeg'
import reservationsImg from './pics/reservation_2.jpeg'

import { CardImg, Alert, Form, Col, Row, Input, Collapse, Button,
    Card, CardBody, CardColumns, CardGroup, CardSubtitle,
    CardTitle, FormGroup, Label, FormFeedback, Breadcrumb, BreadcrumbItem, InputGroup } from "reactstrap";

import { TimeIntervalForm } from "./timeIntervalForm";

export class Reservations extends React.Component { 

    constructor(props){ 
        super(props)
        this.state = { 
            mode: ""
        }

        this.modes = { 
            "freeTable": <FreeTablesMode/>,
            "reservations": <ReservationsMode/>
        }

        this.style = { 
            padding: "20px",
        }
    }

    getPageContent() {
        if (this.state.mode == ""){ 
            return (
                <Row xl={2}>
                    <Col>
                        <Card outline body>
                            <CardImg
                                src={freeTableImg}
                                height="400px"
                                top
                            />
                            <Button onClick={ () => {this.setState({mode: "freeTable"})} }>
                                Show Free Tables
                            </Button>
                        </Card>
                    </Col>
                    <Col>
                        <Card outline body>
                            <CardImg
                                src={reservationsImg}
                                height="400px"
                                top
                            />
                            <Button onClick={ () => {this.setState({mode: "reservations"})} }>
                                Show Reservations
                            </Button>
                        </Card>
                    </Col>
                </Row>
            );
        } else {
            return this.modes[this.state.mode]
        }
    }    

    getBreadCrumbs() { 
        if (this.state.mode != "") { 
            return <BreadcrumbItem active>
                {this.state.mode == "freeTable" ? "Free Tables" : "Reservations"}
            </BreadcrumbItem>
        } else { 
            return null
        }
    }
    
    render() { 
        return(
            <div style={this.style}>
                <Breadcrumb>
                    <BreadcrumbItem 
                        onClick={() => {this.setState({mode: ""})}}
                        active={this.state.mode == ""}
                    >
                        Reservation
                    </BreadcrumbItem>
                    {this.getBreadCrumbs()}
                </Breadcrumb>
                {this.getPageContent()}
            </div>
        );
    }
}

class ReservationsMode extends React.Component { 

    constructor(props) { 
        super(props)
        this.backend_url = "http://185.28.100.111:8080/table";
        this.state = { 
            reservations: [],
            queryFeedback: null
        }
    }
    render() { 
        const handleSubmit = (event) => { 
            event.preventDefault();

            // get form data
            const formData = new FormData(event.target),
            formDataObj = Object.fromEntries(formData.entries());

            // validate data - todo

            // send request
            const start = encodeURIComponent(formDataObj.startDate + "T" + formDataObj.startTime);
            const stop = encodeURIComponent(formDataObj.endDate + "T" + formDataObj.endTime);
            let url = this.backend_url + "/reservation/get?start=" + start + "&stop=" + stop;

            let req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                if(req.status == 200){
                    let res = JSON.parse(req.response)

                    this.setState({
                        reservations: res,
                        queryFeedback: `Found ${res.length} reservations`, 
                        feedbackType: "success",
                    })
                } else { 
                    this.setState({ 
                        reservations: [],
                        queryFeedback: "Error while fetching reservations",
                        feedbackType: "danger",
                    })
                }
            });
            req.addEventListener("error", () => { 
                console.error(req.statusText);
            });
            req.open("get", url, true);
            req.send();
        }

        return <CardColumns>
            <div>
                {TimeIntervalForm(handleSubmit, "Get Reservations")}
                { 
                    this.state.queryFeedback != null ? 
                    <Alert color={this.state.feedbackType}>
                        {this.state.queryFeedback}
                    </Alert>
                    :
                    null
                }
                <CardColumns>
                    { this.state.reservations != null ? this.state.reservations.map((res, index) => { 
                        return (
                            <Reservation
                                key={res.id}
                                reserver={res.name}
                                start={res.begin}
                                end={res.end}
                                people={res.person}
                                table={res.table.name}
                            />
                        )
                    }) : null}
                </CardColumns>
            </div>
        </CardColumns>
    }
}

class FreeTablesMode extends React.Component {

    constructor(props) { 
        super(props)
        this.backend_url = "http://185.28.100.111:8080/table"
        this.state = {
            tables: [],
            queryFeedback: null,
        }
    }    

    render() {
        const getFreeTables = (event) => { 
            event.preventDefault();

            // get form data
            const formData = new FormData(event.target),
            formDataObj = Object.fromEntries(formData.entries());

            // validate data - todo

            // send request
            console.log(formDataObj);
            const start = encodeURIComponent(formDataObj.startDate + "T" + formDataObj.startTime);
            const stop = encodeURIComponent(formDataObj.endDate + "T" + formDataObj.endTime);
            let url = this.backend_url + "/reservation/free?start=" + start + "&stop=" + stop;

            let req = new XMLHttpRequest();
            req.addEventListener("load", () => { 
                if (req.status == 200){
                    let res = JSON.parse(req.response);
                    this.setState({
                        tables: res,
                        queryFeedback: `Found ${res.length} free tables`,
                        feedbackType: "success", 
                    })
                } else { 
                    this.setState({
                        tables: [],
                        queryFeedback: "Error while fetching free tables",
                        feedbackType: "danger",
                    })
                }
                
            });
            req.addEventListener("error", () => { 
                console.error(req.statusText);
            });
            req.open("get", url, true);
            req.send();
        }

        return (
            <div>
                {TimeIntervalForm(getFreeTables, "Get Free Tables")} 
                {
                    this.state.queryFeedback != null ?
                    <Alert color={this.state.feedbackType}>
                        {this.state.queryFeedback}
                    </Alert>
                    :
                    null
                }
                <CardColumns>
                    {            
                        this.state.tables.map((table, index) => {
                            return ( 
                                <Table 
                                    key={table.id}
                                    tableID={table.id}
                                    name={table.name}
                                    capacity={table.capacity}
                                />
                            )
                        })
                    }
                </CardColumns>
            </div>
        );
    }
}

class Table extends React.Component { 

    constructor(props){ 
        super(props)
        this.state = { 
            isOpen: false,
            reservationStatus: null
        }
    }

    render() { 
        const handleSubmit = (event) => { 
            event.preventDefault();
            const formData = new FormData(event.target),
                formDataObj = Object.fromEntries(formData.entries());

            // form data validation - TODO

            // process form data
            let reqBody = {
                id: UUID(),
                name: formDataObj.name,
                contact: formDataObj.contact,
                begin: formDataObj.date + "T" + formDataObj.begin + ":00Z",
                end: formDataObj.date + "T" + formDataObj.end + ":00Z",
                table: { 
                    id: this.props.tableID,
                    name: this.props.name,
                    capacity: this.props.capacity,
                },
                person: formDataObj.people,
            }
            console.log(reqBody);
            
            // send request
            const url = "http://185.28.100.111:8080/table/reservation/save"
            const req = new XMLHttpRequest();
            req.open("POST", url, true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.onload = () => { 
                console.log(`${req.status} \n ${req.response}`)
                this.setState({
                    reservationStatus: req.status == 200 ? "Reservation successful" : "Reservation error",
                    feedbackType: req.status == 200 ? "success" : "danger"
                })
            }
            req.onerror = () => { 
                console.log("Error: " + req.status );
                console.log(req.response);
            }  
            
            req.send(JSON.stringify(reqBody));
            this.setState({
                isOpen: false
            })
        }
        return (
            <Card body outline>
                <CardBody>
                    <CardTitle>
                        Table: {this.props.name}
                    </CardTitle>
                    <CardSubtitle>
                        {"Capacity: " + this.props.capacity}
                    </CardSubtitle>
                    <Collapse isOpen={this.state.isOpen} >
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <FormGroup>
                                    <Label>Name:</Label>
                                    <Input type="text" name="name"/>
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup>
                                    <label>Contact:</label>
                                    <Input type="text" name="contact"/>
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup>
                                    <label>Number of People:</label>
                                    <Input type="number" name="people"/> 
                                </FormGroup>
                            </Row>
                            <Row md={1}>
                                <FormGroup>
                                    <label>Date:</label>
                                    <Input type="date" name="date"/>                               
                                </FormGroup>
                            </Row>
                            <Row md={2}>
                                <Col>
                                    <FormGroup>
                                        <label>From:</label>
                                        <Input type="time" name="begin"/>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label>To:</label>
                                        <Input type="time" name="end"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button onClick={ () => {this.setState({ isOpen: false })} }>Close</Button>
                            {" " /* For space between buttons */}
                            <Button color="success" type="submit">Book</Button>
                        </Form>
                    </Collapse>
                    {
                        this.state.isOpen ?
                        null
                            :
                        <Button onClick={ () => {this.setState({ isOpen: !this.state.isOpen })} }>
                            {this.state.isOpen ? "Close" : "Book this table"}
                        </Button>
                    }
                    {
                        this.state.reservationStatus != null ?
                        <Alert color={this.state.feedbackType}>
                            {this.state.reservationStatus}
                        </Alert>
                        :
                        null
                    }
                </CardBody>
            </Card>
        );
    }
}

class Reservation extends React.Component { 
    
    constructor(props){ 
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    getTime(data) {
        return `${data[0]}-${data[1]}-${data[2]} ${data[3]}:${data[4]}`
    }

    render() { 
        return (
            <Card body outline onClick={() => { this.setState( {isOpen: !this.state.isOpen} )}}>
                <CardBody>
                    <CardTitle>
                        Reservation by: {this.props.reserver}
                    </CardTitle>
                    <CardSubtitle>
                        From: {this.getTime(this.props.start)} - To: {this.getTime(this.props.end)}
                    </CardSubtitle>
                    <Collapse isOpen={this.state.isOpen}>
                        <div>People: {this.props.people}</div>
                        <div>Table: {this.props.table}</div>
                    </Collapse>
                </CardBody>
            </Card>
        )
    }
}