import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import axios from 'axios';
import { CompetitionParticipant } from '@cff/api-interfaces';

type Inputs = {
  cffNumber: string
};

interface EditParticipantProps {
  competitionId: string,
  participantId: string,
  onSave: () => void,
  onCancel: () => void
}

export function EditParticipant(props: EditParticipantProps) {

  const [participant, setParticipant] = useState(null)
  const { register, handleSubmit } = useForm<Inputs>();

  useEffect(() => {
    if (props.participantId) {
      axios.get(`/api/participant/${props.competitionId}/${props.participantId}`).then(response => {
        setParticipant(response.data)
      });
    }
  }, [props.participantId]);

  const onSubmit = (data: Partial<CompetitionParticipant>) => {
    axios.post(`/api/participant/${props.competitionId}/${props.participantId}`, data).then(response => {
      props.onSave()
    });
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
    <DialogTitle id="form-dialog-title">Edit Participant</DialogTitle>
    <DialogContentText>
      {participant ?
        <>You can provide any missing information related to {participant.name} {participant.surname}.</>
        : ''
      }
    </DialogContentText>
      <TextField inputProps={{ "data-testid": "cffNumber" }} name="cffNumber" id="outlined-basic" label="CFF Number" variant="outlined" inputRef={register} />
    <DialogActions>
      <Button data-testid="save-button" type="submit" variant="contained" color="primary">Save</Button>
      <Button data-testid="cancel-button" color="primary" onClick={props.onCancel}>
        Close
      </Button>
    </DialogActions>
      </form>
    </DialogContent>
  );
}

export default EditParticipant;
