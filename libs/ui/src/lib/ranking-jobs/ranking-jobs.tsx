import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, TableContainer, Table, TableBody, Paper, TableRow, TableCell, TableHead } from '@material-ui/core';
import { RankingJob } from '@cff/api-interfaces';

export function RankingJobs() {
  const history = useHistory();
  const [rankingJobs, setRankingJobs] = useState<RankingJob[]>([])
  const [reload, setReload] = useState(0)
  useEffect(() => {
    axios.get('/api/rankings/jobs').then(response => {
      setRankingJobs(response.data)
    });
  }, [reload])

  const rank = () => {
    axios.get('/api/rank').then(response => {
      setReload(r => r + 1)
    });
  }

  const showJobDetails = (id) => {
    history.push("/rankings/jobs/" + id)
  }

  return (
    <>
      <Button variant="contained" color="primary" data-testid="rank-button" onClick={() => rank()}>Create Ranking</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableCell>User</TableCell>
              <TableCell>Date Generated</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rankingJobs.map(row => (
                <TableRow key={row._id}>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.dateGenerated}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" data-testid="rank" onClick={() => showJobDetails(row._id)}>Ranking</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RankingJobs;
