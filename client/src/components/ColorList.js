import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    color: "",
    code: {
      hex: ""
    }
  })

  const editColor = color => {
    setEditing(true);
    setAdding(false);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth().put(`/api/colors/${colorToEdit.id}`, colorToEdit).then(response => {
      console.log(response);
      updateColors(colors.map(element => (colorToEdit.id === element.id) ? colorToEdit : element))
    })
  };

  const deleteColor = color => {
    console.log(color.id);
    axiosWithAuth().delete(`/api/colors/${color.id}`).then(response => {
      console.log(response);
      updateColors(colors.filter(element => (color.id !== element.id)));
    })
    .catch(error => {
      console.log(error);
    })
  };

  const toggleAdding = () => {
    setAdding(!adding);
    setEditing(false);
  }

  const addColor = event => {
    event.preventDefault();
    axiosWithAuth().post("/api/colors", newColor).then(response => {
      console.log(response);
      updateColors([...colors, newColor])
    })
  }

  return (
    <div className="colors-wrap">
      <div className="color-heading"><p>colors&nbsp;<i onClick={toggleAdding} className="icon fas fa-plus"></i></p></div>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              type="color"
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {adding && (
      <form onSubmit={addColor}>
        <legend>add color</legend>
        <label htmlFor="color">
          color name:
          <input type="text" id="color" onChange={e => {
            setNewColor({
              ...newColor,
              color: e.target.value
            })
          }}/>
        </label>
        <label htmlFor="color">
          hex:
          <input type="color" id="color" onChange={e => {
            setNewColor({
              ...newColor,
              code : { hex: e.target.value }
            })
          }}/>
        </label>
        <div className="button-row">
          <button type="submit">Add</button>
        </div>
      </form>
      )}
      <div className="spacer" />
    </div>
  );
};

export default ColorList;
