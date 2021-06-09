import React, { useEffect, useState } from 'react';

import { Competition, CompetitionZone } from '@cff/api-interfaces';
import axios from 'axios';
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup, TableBody
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

export function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competition, setCompetition] = useState<Competition>();
  const [openAddDialog, setAddDialogOpen] = useState(false);
  const [openEditDialog, setEditDialogOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const { register, handleSubmit } = useForm<Competition>();
  const { register: registerSave, control, handleSubmit: handleSubmitSave, setValue } = useForm<Competition>(
    {shouldUnregister: false}
  );
  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data);
    });
  }, [reload]);

  const onSubmit = (data: Competition) => {
    axios.put('/api/competition', data).then(response => {
      setReload(reload + 1);
      setAddDialogOpen(false);
    });
  };

  const onSave = (data: Competition) => {
    const payload = {...competition, name: data.name}
    axios.post('/api/competition', payload).then(() => {
      setReload(reload + 1);
      setEditDialogOpen(false);
    });
  };

  const showEditDialog = (c: Competition) => {
    setCompetition(c)
    setValue('name', c.name)
    setEditDialogOpen(true);
  };

  const onDelete = (code: string) => {
    axios.delete('/api/competition', { data: { code: code } }).then(() => {
      setReload(reload + 1);
      setAddDialogOpen(false);
    });
  };

  return (
    <div>
      <Button variant="contained" color="primary" data-testid="add-button" onClick={() => setAddDialogOpen(true)}>Add
        Competition</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitions && competitions.map((row: Competition) =>
              <TableRow key={row.code}>
                <TableCell scope="row">{row.name}</TableCell>
                <TableCell scope="row">{row.code}</TableCell>
                <TableCell scope="row">{row.zone}</TableCell>
                <TableCell scope="row">
                  <IconButton edge="end" aria-label="edit" data-testid="edit-button-x"
                              onClick={() => showEditDialog(row)}>
                    <EditIcon/>
                  </IconButton>
                </TableCell>
                <TableCell scope="row">
                  <IconButton edge="end" aria-label="delete" data-testid="delete-button"
                              onClick={() => onDelete(row.code)}>
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openEditDialog} onClose={() => setEditDialogOpen(false)} aria-labelledby="form-dialog-title2">
        <form onSubmit={handleSubmitSave(onSave)}>
          <DialogTitle>Edit Competition</DialogTitle>
          <DialogContent>

                <TextField
                  autoFocus
                  name="name"
                  margin="dense"
                  inputProps={{ 'data-testid': 'name-save' }}
                  label="Name"
                  type="text"
                  inputRef={registerSave}
                  fullWidth
                />


          </DialogContent>
          <DialogActions>
            <Button color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" data-testid="save-button-confirm">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openAddDialog} onClose={() => setAddDialogOpen(false)} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add a Competition</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              inputProps={{ 'data-testid': 'name' }}
              label="Name"
              name="name"
              inputRef={register}
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              inputProps={{ 'data-testid': 'code' }}
              label="Code"
              name="code"
              inputRef={register}
              type="text"
              fullWidth
            />
            <br/><br/>
            <FormLabel component="legend">Zone</FormLabel>
            <RadioGroup aria-label="gender" name="zone" defaultValue={CompetitionZone.cff}>
              {Object.values(CompetitionZone).map(value =>
                (<FormControlLabel control={<Radio value={value} inputRef={register}/>} label={value}/>)
              )}
            </RadioGroup>
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
