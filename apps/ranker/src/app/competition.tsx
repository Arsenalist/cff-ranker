import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router'
import axios from 'axios';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Chip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { EditParticipant } from './participant-edit';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export function ViewCompetition() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [participantId, setParticipantId] = useState(null);
  const effectToken = []
  const handleClose = () => {
    setOpen(false);
  };

  const editParticipant = (participantId) => {
    setParticipantId(participantId)
    setOpen(true)
  }

  const onSave = () => {
    setOpen(false)
    effectToken.push(0)
  }

  const [competition, setCompetition] = useState({})
  useEffect(() => {
    axios.get(`/api/competition/${id}`).then(response => {
      setCompetition(response.data)
    });
  }, [effectToken]);


  return (
    <div>
      <Card>
        <CardContent>
          <Typography gutterBottom>
            {competition.competitionDate}
          </Typography>
          <Typography variant="h5" component="h2">
            {competition.tournamentName} ({competition.competitionShortName})
          </Typography>
          <Typography variant="body2" component="p">
            Age Category {competition.ageCategory}
          </Typography>
          <Typography variant="body2" component="p">
            Competition Type {competition.competitionType}
          </Typography>
          <Typography variant="body2" component="p">
            Gender {competition.gender}
          </Typography>
          <Typography variant="body2" component="p">
            Weapon {competition.weapon}
          </Typography>
          <Typography variant="body2" component="p">
            Creator: {competition.creator}
          </Typography>
        </CardContent>
      </Card>
      <p>
      <Button variant="contained" color="primary" disabled>
        Approve
      </Button>&nbsp;&nbsp;&nbsp;
      <Button variant="contained" color="secondary">
        Reject
      </Button>
      </p>
      <p>
        This competition cannot be approved as it has warnings. Fix the warnings to approve competition.
      </p>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>CFF#</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>YOB</TableCell>
            <TableCell>Validated</TableCell>
            <TableCell>Club</TableCell>
            <TableCell>Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competition && competition.results ?
            competition.results.map((row) => (
              <>
            <TableRow key={row._id}>
              <TableCell scope="row">
                {row.rank}
              </TableCell>
              <TableCell scope="row">
                {row.name} {row.surname}
              </TableCell>
              <TableCell scope="row">
                {row.cffNumber}
              </TableCell>
              <TableCell scope="row">
                {row.gender}
              </TableCell>
              <TableCell scope="row">
                {row.yearOfBirth}
              </TableCell>
              <TableCell scope="row">
                {row.validated}
              </TableCell>
              <TableCell scope="row">
                {row.club}
              </TableCell>
              <TableCell scope="row">
                {row.country}
              </TableCell>
            </TableRow>
              <TableRow>
                {row.warnings.map((warning) => (
                  <>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={(e) => editParticipant(row._id)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell colSpan={7}>
                    <Chip
                      label={warning.type}
                      color="secondary"
                    />
                  </TableCell>
                  </>
                ))}
              </TableRow>
            </>
          )) : ''}
        </TableBody>
      </Table>
    </TableContainer>
    <EditParticipant onSave={onSave} competitionId={competition._id}  participantId={participantId} open={open} onClose={handleClose}/>
    </div>
  )


}
