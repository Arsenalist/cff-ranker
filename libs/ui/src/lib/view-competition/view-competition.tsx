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
import EditParticipant from '../edit-participant/edit-participant'
import CompetitionHeader from '../competition-header/competition-header';
import Dialog from '@material-ui/core/Dialog';
import { CompetitionParticipant, CompetitionResult, CompetitionStatus } from '@cff/api-interfaces';

function checkHasWarnings(competition: CompetitionResult) {
  return competition.results.filter((r) => r.warnings.length !== 0).length !== 0;
}

export function ViewCompetition() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [hasWarnings, setHasWarnings] = useState(false);
  const [introMessage, setIntroMessage] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [competition, setCompetition] = useState<CompetitionResult>(null)
  const [reload, setReload] = useState(0)

  const handleClose = () => {
    setOpen(false);
  };

  const editParticipant = (participantId: string) => {
    setParticipantId(participantId)
    setOpen(true)
  }

  const onSave = () => {
    setOpen(false)
    setReload(reload + 1)
  }

  function changeStatus(status: CompetitionStatus) {
    axios.post(`/api/competition/status`, {
      competitionId: competition._id,
      status: status
    }).then(response => {
      setReload(reload + 1);
    });
  }

  const approve = () => {
    changeStatus(CompetitionStatus.approved);
  }

  const reject = () => {
    changeStatus(CompetitionStatus.rejected);
  }

  useEffect(() => {
    axios.get(`/api/competition/${id}`).then(response => {
      setCompetition(response.data)
      const hasWarningsVar = checkHasWarnings(response.data)
      setHasWarnings(hasWarningsVar)
      if (hasWarningsVar) {
        setIntroMessage("This competition cannot be approved as it has warnings. Fix the warnings to approve competition.")
      } else {
        setIntroMessage("This competition has no warnings and can be approved.")
      }
    });
  }, [reload, id]);

  const WarningRow = (props: {participant: CompetitionParticipant}) => (
    <>
      {props.participant.warnings.map((warning) => (
      <TableRow key={`${props.participant._id} ${warning.type}`}>
        <TableCell>
          <Button data-testid="edit-button" variant="outlined" color="primary"
                  onClick={(e) => editParticipant(props.participant._id)}>
            Edit
          </Button>
        </TableCell>
        <TableCell colSpan={7}>
          <Chip
            label={warning.type}
            color="secondary"
          />
        </TableCell>
      </TableRow>
    ))}
      </>
  )
  return (
      <>
        <CompetitionHeader competition={competition}/>
        <p>
          {competition && competition.status !== CompetitionStatus.approved &&
          <Button variant="contained" color="primary" data-testid="approve-button" disabled={hasWarnings}
                  onClick={approve}>
            Approve
          </Button>}
          {competition && competition.status === CompetitionStatus.approved &&
          <Chip
            data-testid="approved-chip"
            label="Approved Competition"
            color="primary"
            variant="default"/>}
          {competition && competition.status !== CompetitionStatus.rejected &&
          <Button variant="contained" data-testid="reject-button" color="secondary" onClick={reject}>
            Reject
          </Button>}
          {competition && competition.status === CompetitionStatus.rejected &&
          <Chip
            data-testid="rejected-chip"
            label="Rejected Competition"
            color="secondary"
            variant="default"/>}
        </p>
        <p>
          {introMessage}
        </p>
        <TableContainer component={Paper}>
          <Table>
            <TableHead key={"header"}>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>CFF#</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>YOB</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>Club</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody key="participants">
            {competition && competition.results && competition.results.map((row) => (
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
                  {row.completed}
                </TableCell>
                <TableCell scope="row">
                  {row.club}
                </TableCell>
                <TableCell scope="row">
                  {row.country}
                </TableCell>
              </TableRow>
                <WarningRow participant={row} key={`warning=${row._id}`}/>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        {competition ? <EditParticipant onSave={onSave} onCancel={handleClose} competitionId={competition._id}
                                        participantId={participantId}/>
          : ''}
      </Dialog>
    </>
  )
}

export default ViewCompetition;
