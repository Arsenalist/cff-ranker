import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Competition, CompetitionResults } from '@cff/api-interfaces';
import axios from 'axios';
import { List, ListItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

/* eslint-disable-next-line */
export interface CompetitionListProps {}

const StyledCompetitionList = styled.div`
  color: pink;
`;

export function CompetitionList(props: CompetitionListProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [openAddDialog, setOpenAddDialog] = useState(false)
  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data)
    });
  }, []);

  const doOpenAddDialog = () => {
    setOpenAddDialog(true)
  }

  return (
    <div>
      <Button data-testid="add-button" onClick={doOpenAddDialog}>Add Competition</Button>
      <List>
      {competitions && competitions.map((row: Competition) =>
      <ListItem>
        <ListItemText primary={row.name} secondary={row.code} />
      </ListItem>
      )}
    </List>
      <Dialog open={openAddDialog} aria-labelledby="form-dialog-title">
        <DialogTitle >Add a Competition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="code"
            label="code"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary">
            Cancel
          </Button>
          <Button color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CompetitionList;
