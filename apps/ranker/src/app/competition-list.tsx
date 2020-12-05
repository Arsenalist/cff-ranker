import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Chip } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';

export function CompetitionList() {
  const [competitions, setCompetitions] = useState([])
  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data)
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Weapon</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competitions.map((row) => (
            <TableRow key={row._id}>
              <TableCell scope="row">
                <Link to={{pathname: `/competition/${row._id}`}} >
                  {row.tournamentName}
                </Link>
              </TableCell>
              <TableCell scope="row">
                {row.competitionDate}
              </TableCell>
              <TableCell scope="row">
                {row.competitionType}
              </TableCell>
              <TableCell scope="row">
                {row.weapon}
              </TableCell>
              <TableCell scope="row">
                {row.gender}
              </TableCell>
              <TableCell scope="row">
                {row.ageCategory}
              </TableCell>
              <TableCell scope="row">
                <Chip
                  label="Pending"
                  color="secondary"
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
