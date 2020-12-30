import React, { useContext, useEffect, useState } from 'react';

import { Competition, CompetitionResults } from '@cff/api-interfaces';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import { MessagesContext } from '../messages/messages-context';
import UploadFile from '../upload-file/upload-file';
import CompetitionHeader from '../competition-header/competition-header';


export function UploadCompetitionResults() {
  const [competitionResults, setCompetitionResults] = useState<CompetitionResults>(null);
  const [competition, setCompetition] = useState<Competition>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const { addErrors } = useContext(MessagesContext);

  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data)
    });
  }, []);

  const collectFormData = () => {
    if (competition) {
      return { name: 'code', value: competition.code }
    } else {
      return null
    }
  }

  const validate = () => {
    if (competition == null) {
      addErrors(["Please select a competition."])
      return false
    }
    return true
  }

  return (
    <div>
      <p>
        Please select a competition code.
      </p>
      <Autocomplete
        onChange={(event, value: Competition) => setCompetition(value)}
        data-testid="competition-code"
        options={competitions}
        getOptionLabel={(option) => `${option.code} - ${option.zone}/${option.name}`}
        style={{ width: 300 }}
        renderInput={(params) => <TextField inputProps={{"data-testid": "competitionResults-code-input"}} {...params} label="Competition" variant="outlined" />}
      />
      <p>
        Please specify a competition file.
      </p>
      <UploadFile preUploadHandler={collectFormData} postUploadHandler={setCompetitionResults} endpoint = "/api/upload-competition-file" validate={validate}/>
      {competitionResults &&
      <div>
        <CompetitionHeader competition={competitionResults} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>YOB</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>CFF Number</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Club</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Validated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitionResults.results.map((row) => (
                <TableRow key={row.cffNumber}>
                  <TableCell component="th" scope="row">
                    {row.name} {row.surname}
                  </TableCell>
                  <TableCell>{row.yearOfBirth}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.cffNumber}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.club}</TableCell>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.validated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      }
    </div>
  )
}

export default UploadCompetitionResults;

