import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';

type Inputs = {
  cffNumber: string
};

function EditParticipant(props) {

  const [participant, setParticipant] = useState(null)

  useEffect(() => {
    if (props.participantId) {
      axios.get(`/api/participant/${props.competitionId}/${props.participantId}`).then(response => {
        console.log(response.data)
        setParticipant(response.data)
      });
    }
  }, [props.participantId]);


  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit = data => {
    axios.post(`/api/participant/${props.competitionId}/${props.participantId}`, data).then(response => {
      props.onSave()
    });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
    <DialogTitle id="form-dialog-title">Edit Participant</DialogTitle>
    <DialogContentText>
      {participant ?
        <p>You can provide any missing information related to {participant.name} {participant.surname}.</p>
        : ''
      }
    </DialogContentText>
      <TextField name="cffNumber" id="outlined-basic" label="CFF Number" variant="outlined" inputRef={register} />
    <DialogActions>
      <Button type="submit" variant="contained" color="primary">Save</Button>
      <Button color="primary" onClick={props.onClose}>
        Close
      </Button>
    </DialogActions>
      </form>
    </DialogContent>
    </Dialog>
  );
}

export { EditParticipant };


