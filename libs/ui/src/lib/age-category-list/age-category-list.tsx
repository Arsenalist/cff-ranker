import React, { useEffect, useState } from 'react';

import { AgeCategory } from '@cff/api-interfaces';
import axios from 'axios';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';


export function AgeCategoryList() {
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([])
  const [editMode, setEditMode] = useState<{_id: null | string, editMode: null | boolean} >({_id: null, editMode: null});
  const [previous, setPrevious] = useState({});
  const [reload, setReload] = useState(0)
  const [addDialog, setAddDialogOpen] = useState(false)
  const { register, handleSubmit } = useForm<AgeCategory>();

  useEffect(() => {
    axios.get('/api/age-category').then(response => {
      response.data.forEach(c => {
        setEditMode(state => ({...state, [c._id]: false}))
      })
      setAgeCategories(response.data)
    });
  }, [reload])

  const onToggleEditMode = id => {
    setEditMode(state => ({...state, [id]: !state[id]}))
  };

  const onChange = (e, row) => {
    if (!previous[row._id]) {
      setPrevious((state) => ({ ...state, [row._id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { _id } = row;
    const newRows = ageCategories.map((row) => {
      if (row._id === _id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setAgeCategories(newRows);
  };

  const deleteRecord = (id) => {
    axios.delete('/api/age-category', {data: {_id: id}}).then(response => setReload(state => state + 1) )
  }

  const onSave = (id) => {
    const toSave = ageCategories.filter(row => row._id === id)[0]
    axios.post('/api/age-category', toSave).then(response => {
      onToggleEditMode(id)
      setReload(state => state + 1)
    } )
  };

  const onSubmit = (data: AgeCategory) => {
    axios.put("/api/age-category", data).then(response => {
      setAddDialogOpen(false)
      setReload(state => state + 1)
    });
  };


  const onCancel = id => {
    const newRows = ageCategories.map((row) => {
      if (row._id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setAgeCategories(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const AddButton = () => (<Button variant="contained" color="primary" data-testid="add-button" onClick={() => setAddDialogOpen(true)}>Add Age Category</Button>)
  if (!ageCategories) {
    return AddButton
  }

  return (
    <Paper>
      <Button variant="contained" color="primary" data-testid="add-button" onClick={() => setAddDialogOpen(true)}>Add Age Category</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Year of Birth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ageCategories.map(row =>
            <TableRow key={row._id}>
              <TableCell>
                {editMode[row._id] ? (
                  <>
                    <IconButton
                      aria-label="save"
                      data-testid={`save-button-${row["_id"]}`}
                      onClick={() => onSave(row._id)}
                    >
                      Save
                    </IconButton>
                    <IconButton
                      aria-label="cancel"
                      data-testid={`cancel-button-${row["_id"]}`}
                      onClick={() => onCancel(row._id)}
                    >
                      Cancel
                    </IconButton>
                  </>
                ) : (
                  <>
                  <IconButton
                    aria-label="edit"
                    data-testid={`edit-button-${row["_id"]}`}
                    onClick={() => onToggleEditMode(row._id)}
                  >
                    Edit
                  </IconButton>
                  <IconButton
                  aria-label="delete"
                  data-testid={`delete-button-${row["_id"]}`}
                  onClick={() => deleteRecord(row._id)}
                  >
                  Delete
                  </IconButton>
                  </>
                )}
              </TableCell>
              <TableCell>
                {editMode[row._id] ? (
                  <TextField
                    inputProps={{ "data-testid": `name-${row["_id"]}` }}
                    value={row.name}
                    name="name"
                    onChange={e => onChange(e, row)}
                  />
                ) : (
                  row.name
                )}
              </TableCell>
              <TableCell>
                {editMode[row._id] ? (
                  <TextField
                    inputProps={{ "data-testid": `code-${row["_id"]}` }}
                    value={row.code}
                    name="code"
                    onChange={e => onChange(e, row)}
                  />
                ) : (
                  row.code
                )}
              </TableCell>
              <TableCell>
                {editMode[row._id] ? (
                  <TextField
                    inputProps={{ "data-testid": `yearOfBirth-${row["_id"]}` }}
                    value={row.yearOfBirth}
                    name="yearOfBirth"
                    onChange={e => onChange(e, row)}
                  />
                ) : (
                  row.yearOfBirth
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  <Dialog open={addDialog}  onClose={() => setAddDialogOpen(false)} aria-labelledby="form-dialog-title">
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle >Add Age Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          inputProps={{ "data-testid": "name" }}
          label="Name"
          name="name"
          inputRef={register}
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          inputProps={{ "data-testid": "code" }}
          label="Code"
          name="code"
          inputRef={register}
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          inputProps={{ "data-testid": "yearOfBirth" }}
          label="Year of Birth"
          name="yearOfBirth"
          inputRef={register}
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={e => setAddDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" data-testid="add-button-confirm">
          Add
        </Button>
      </DialogActions>
    </form>
  </Dialog>
    </Paper>
);
}

export default AgeCategoryList;
