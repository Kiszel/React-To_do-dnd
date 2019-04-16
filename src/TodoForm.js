import React, { Component } from 'react';
import './TodoForm.css';
import {InputGroup,FormControl,Button,Container,Row,Col,Form} from 'react-bootstrap';
import shortid from 'shortid';

class TodoForm extends Component {
    constructor(props){
        super(props)
    
    this.state={
        name:'',
        date:""
    }
    this.onSubmit=this.onSubmit.bind(this);
}
onSubmit=(event)=>{
    event.preventDefault();
    if(this.nameinput.value!==""){
    let complete=false;
    let id=shortid.generate();
    this.props.AddTodo(this.nameinput.value,this.dateinput.value,complete,id);
    this.nameinput.value="";
    this.dateinput.value="";
    }
}
    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }
  render() {
    return (
        <Container >
            <Form onSubmit={this.onSubmit}>
                <Row >
                    <InputGroup className="inputGroup">
                        <FormControl className="input" value={this.state.name} onChange={this.handleChange} type="text" name="name" ref={nameinput=>this.nameinput=nameinput} placeholder="name"/>
                        <FormControl className="input" value={this.state.date} onChange={this.handleChange} type="date" name="date" ref={dateinput=>this.dateinput=dateinput}placeholder="date"/>
                        <Button className="add_todo" onClick={this.onSubmit} >add todo</Button>
                    </InputGroup>
                </Row>
            </Form>
        </Container>
    );
  }
}

export default TodoForm;
