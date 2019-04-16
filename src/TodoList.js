import React, { Component } from 'react';
import './TodoList.css';
import TodoForm from './TodoForm';
import {Button,Container,Row,Col,Form} from 'react-bootstrap';
import Todo from "./Todo";
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

var update = require('react-addons-update');

  class TodoList extends Component {
    constructor(props){
      super(props);
  
      this.state={
        to_dos: JSON.parse(localStorage.getItem('to_dos')),
        showundobutton:JSON.parse(localStorage.getItem('showundobutton')),
        undo_todo:JSON.parse(localStorage.getItem('undo_todo'))
      }
      this.DeleteTodo=this.DeleteTodo.bind(this);
      this.AddTodo=this.AddTodo.bind(this);
    }
    moveCard = (dragIndex, hoverIndex) => {
      const { to_dos } = this.state
      const dragCard = to_dos[dragIndex]
  
      this.setState(
        update(this.state, {
          to_dos: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
          },
        }),
      )
      localStorage.setItem('to_dos',JSON.stringify(this.getTodos()))
    }
    getTodos=()=>{
      return this.state.to_dos;
    }
    getUndo_Todo=()=>{
      return this.state.undo_todo;
    }
    getUndo_button=()=>{
      return this.state.showundobutton;
    }
    DeleteTodo=(id)=>{
      const to_dos=this.getTodos();
      const filteredTo_dos=to_dos.filter(to_do=>{
        if(to_do.id===id){
          localStorage.setItem('undo_todo',JSON.stringify(to_do))
          this.setState({undo_todo:to_do})
        }
        return to_do.id!==id;
      })
      console.log(filteredTo_dos)
      localStorage.setItem('to_dos',JSON.stringify(filteredTo_dos))
      localStorage.setItem('showundobutton',JSON.stringify(true))
      this.setState({
        to_dos:filteredTo_dos,
        showundobutton:true 
      })     
    }

    UndoDeleteTodo=(todo)=>{
      console.log(this.state.undo_todo)
      console.log(localStorage.getItem('undo_todo'))
      console.log(todo)
      const to_dos=this.getTodos();
      const name=todo.name;
      const date=todo.date;
      const complete=todo.complete;
      const id=todo.id;
      to_dos.push({
        name,
        date,
        complete,
        id
      })
      this.setState({
        to_dos,
        showundobutton:false
      })
      const showundobutton=false
      localStorage.setItem('to_dos',JSON.stringify(to_dos));
      localStorage.setItem('showundobutton',JSON.stringify(showundobutton));
    }
    AddTodo=(name,date,complete,id)=>{
      console.log(date,name,complete,id)
      const to_dos=this.getTodos();
      to_dos.push({
        name,
        date,
        complete,
        id
      })
      this.setState({
        to_dos
      })
      localStorage.setItem('to_dos',JSON.stringify(to_dos));
    }
    CompleteChange=(id)=>{
      let to_dos=this.state.to_dos
      to_dos.map(todo=>{
        if(todo.id===id){
          todo.complete=!todo.complete
        }
      })
      this.setState({to_dos})
     console.log(to_dos)
      localStorage.setItem('to_dos',JSON.stringify(to_dos))
    }
    render() {
      return (
        <div className="TodoList">
          <div>
            <TodoForm AddTodo={this.AddTodo}/>
          </div>
            <Container className="to_dos-list">
                <Row>
                    <Col>
                    <div  className="card-container">
                    {
                      this.state.to_dos.map((to_do,id)=>{
                        return(
                          <div draggable >
                          <Todo 
                          key={id}
                          index={id}
                          checked={to_do.complete} 
                          id={to_do.id} 
                          name={to_do.name} 
                          date={to_do.date} 
                          CompleteChange={()=>this.CompleteChange(to_do.id)}
                          DeleteTodo={()=>this.DeleteTodo(to_do.id)}
                          moveCard={this.moveCard}
                          />
                          </div>
                            )
                        })
                        }
                        </div>
                    </Col>
                </Row>
            </Container>
            <div>
                {this.state.showundobutton?<Button  variant="outline-warning" onClick={() => this.UndoDeleteTodo(this.getUndo_Todo())}>Removed todo:undo</Button>:null}
              </div>
        </div>
        );
        }
    }
    
export default DragDropContext(HTML5Backend)(TodoList);