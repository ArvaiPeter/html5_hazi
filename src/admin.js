import React from "react";
import { Button, FormGroup, Col, Card, Form, Row, Input, Label } from "reactstrap";

export class Admin extends React.Component { 

    render() { 
        return (
            <Card
            body
            className='text-center'
            style={{
                margin: "40px auto auto auto",
                width: "40rem"
            }}>
                <Form onSubmit={(event) => {event.preventDefault()}}>
                    <Row>
                        <FormGroup floating>
                            <Input type="email" placeholder="Email"/>
                            <Label style={{ marginLeft: "20px" }}>Email</Label>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup floating>
                            <Input type="password" placeholder="Password"/>
                            <Label style={{ marginLeft: "20px" }}>Password</Label>
                        </FormGroup>
                    </Row>
                    <Row className="m-auto justify-content-center">
                        <Button>Login</Button>
                    </Row>
                </Form>
            </Card>
        );
    }
}