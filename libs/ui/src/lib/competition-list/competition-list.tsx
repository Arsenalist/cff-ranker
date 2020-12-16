import React, { useEffect, useState } from 'react';

import { Competition } from '@cff/api-interfaces';
import axios from 'axios';
import { List, ListItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { useForm } from 'react-hook-form';


export function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [openAddDialog, setAddDialogOpen] = useState(false)
  const [reload, setReload] = useState(0)
  const { register, handleSubmit } = useForm<Competition>();
  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data)
    });
  }, [reload]);

  const onSubmit = (data: Competition) => {
    axios.put('/api/competition', data).then(response => {
      setReload(reload + 1)
      setAddDialogOpen(false)
    });
  }

  return (
    <div>
      <Button data-testid="add-button" onClick={() => setAddDialogOpen(true)}>Add Competition</Button>
      <List>
      {competitions && competitions.map((row: Competition) =>
      <ListItem>
        <ListItemText primary={row.name} secondary={row.code} />
      </ListItem>
      )}
    </List>
      <Dialog open={openAddDialog}  onClose={() => setAddDialogOpen(false)} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle >Add a Competition</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" data-testid="add-button-confirm">
            Add
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default CompetitionList;
