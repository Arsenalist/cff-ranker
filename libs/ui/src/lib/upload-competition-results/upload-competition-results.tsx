import React, { useState } from 'react';

import { CompetitionResults } from '@cff/api-interfaces';
import { CompetitionHeader, UploadFile } from '../..';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

export function UploadCompetitionResults() {
  const [competition, setCompetition] = useState<CompetitionResults>(null);

  return (
    <div>
      <p>
        Please specify a competition file.
      </p>
      <UploadFile postUploadHandler={setCompetition} endpoint = "/api/upload-competition-file"/>
      {competition &&
      <div>
        <CompetitionHeader competition={competition} />
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
              {competition.results.map((row) => (
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

