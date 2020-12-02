import { ValidationFileUpload } from './validation-file-upload';
import React, { useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DataGrid } from '@material-ui/data-grid';

export function ValidateFileUploadPage() {
  return (
    <div>
      <p>
        Please specify a validation file.
      </p>
      <ValidationFileUpload endpoint = "/api/upload-validation-file"/>
    </div>
  )
}

export function CompetitionUploadPage() {
  const [competition, setCompetition] = useState(null);
  function displayCompetition(competition) {
    console.log("it got called ", competition)
    setCompetition(competition)
  }



  return (
    <div>
      <p>
        Please specify a competition file.
      </p>
      <ValidationFileUpload postUploadHandler={displayCompetition}  endpoint = "/api/upload-competition-file"/>
      {competition &&
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
                <TableRow key={row.name}>
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

export function ClassificationUploadPage() {
  return (
    <div>
      <p>
        Please specify a classification file.
      </p>
      <ValidationFileUpload endpoint = "/api/upload-competition-file"/>
    </div>
  )
}


const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue('firstName') || ''} ${
        params.getValue('lastName') || ''
      }`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


export function ViewRankingsPage() {
  return (
    <div>
      <p>
        Here are the rankings:
      </p>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div>
    </div>
  )
}
