import React, { Component } from 'react';
import {Button,Row,Col,Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';
import flow from 'lodash/flow';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
  };
  
  const cardSource = {
    beginDrag(props) {
      return {
        id: props.id,
        index: props.index,
      }
    },
  };
  
  const cardTarget = {
    hover(props, monitor, component) {
      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index
  
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
  
      // Determine rectangle on screen
      const hoverBoundingRect = (findDOMNode(
        component,
      )).getBoundingClientRect();
  
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  
      // Determine mouse position
      const clientOffset = monitor.getClientOffset(); 
  
      // Get pixels to the top
      const hoverClientY = (clientOffset).y - hoverBoundingRect.top;
  
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
  
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
  
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);
  
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  }
  
  class Todo extends React.Component {
    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      connectDropTarget: PropTypes.func.isRequired,
      index: PropTypes.number.isRequired,
      isDragging: PropTypes.bool.isRequired,
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      moveCard: PropTypes.func.isRequired,
      checked:PropTypes.bool.isRequired,
      date:PropTypes.string.isRequired,
      CompleteChange:PropTypes.func.isRequired,
      DeleteTodo:PropTypes.func.isRequired
    }
  
    render() {
      const {
        name,
        key,
        date,
        DeleteTodo,
        checked,
        CompleteChange,
        isDragging,
        connectDragSource,
        connectDropTarget,
      } = this.props;
      const opacity = isDragging ? 0 : 1;
  
      return (
        connectDragSource &&
        connectDropTarget &&
        connectDragSource(
          connectDropTarget(<div style={{ ...style, opacity }}> 
          <Row  key={key}    >
            <Col  > <Form.Check onChange={CompleteChange} checked={checked} type="checkbox"  /></Col >
            <Col  > {name} </Col>
            <Col xs={9} className="to_do-dates" > {date}</Col>
            <Col >  <Button variant="outline-warning" onClick={DeleteTodo}>Delete</Button></Col>
      </Row></div>),
        )
      );
    }
  }
  
  export default flow(
    DragSource(
      'card',
      cardSource,
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
      }),
    ),
    DropTarget('card', cardTarget, (connect) => ({
      connectDropTarget: connect.dropTarget(),
    }))
  )(Todo);