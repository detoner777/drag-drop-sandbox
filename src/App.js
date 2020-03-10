import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid from "uuid/v4";

const itemsFromBackend = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" }
];

const columnsFromBackend = {
  [uuid()]: {
    name: "Todo",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "In progress",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

const App = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div className="container">
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div className="drag-drop-container">
              <h2>{column.name}</h2>
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="dropable"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgrey"
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="draggable"
                                  style={{
                                    backgroundColor: snapshot.isDragging
                                      ? "#263B4A"
                                      : "#456C86",
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  {item.content}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default App;

// https://www.youtube.com/watch?v=uHO3mQgs-e8
