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
import { Link } from 'react-router-dom';
import { AgeCategory, CompetitionResult, CompetitionStatus } from '@cff/api-interfaces';

export function CompetitionResultsList() {
  const [competitions, setCompetitions] = useState<CompetitionResult[]>([])
  useEffect(() => {
    axios.get('/api/competition-results').then(response => {
      setCompetitions(response.data)
    });
  }, []);

  const statusChip = (status) => {
    switch(status) {
      case CompetitionStatus.approved:
        return <Chip label="Approved" color="primary" variant="default" />
      case CompetitionStatus.pending:
        return <Chip label="Pending" color="secondary" variant="default" />
      case CompetitionStatus.rejected:
        return <Chip label="Rejected" color="default" variant="default" />
    }
  };

  const formatDate = (date) =>  {
    const d = new Date(date);
    return d.toLocaleDateString()
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow key="header">
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Weapon</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Age Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competitions.map((row) => {
            return (
              <TableRow key={row._id}>
                <TableCell scope="row">
                  <Link to={{ pathname: `/competition/${row._id}` }}>
                    {row.tournamentName}
                  </Link>
                </TableCell>
                <TableCell scope="row">
                  {formatDate(row.competitionDate)}
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
                  {(row.ageCategory as AgeCategory).name}
                </TableCell>
                <TableCell scope="row">
                  {statusChip(row.status)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
