import { Container, Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap'

export function TimeIntervalForm(onFormSubmitCB, buttonText) { 
    const style = { 
        margin: "0",
        padding: "0",
    }
    return (
        <Form onSubmit={onFormSubmitCB} >
            <Container fluid style={style}>
                <Row>
                    <Col>
                        <FormGroup floating>
                            <Input name="startDate" type="date" placeholder='From:'/>
                            <Label>From:</Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup floating>
                            <Input name="endDate" type="date" placeholder='To:'/>
                            <Label>To:</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input name="startTime" type="time"/>
                    </Col>
                    <Col>
                        <Input name="endTime" type="time"/>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Button
                            type="submit"
                            style={{margin: "10px"}}
                        >
                            {buttonText}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}