import React, { useEffect, useState } from 'react';

import {useParams} from 'react-router'
import axios from 'axios';
import { Ranking } from '@cff/api-interfaces';
import TableContainer from '@material-ui/core/TableContainer';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";

export function Rankings() {
  const { id } = useParams()
  const history = useHistory();
  const [rankings, setRankings] = useState<Ranking[]>([])

  useEffect(() => {
    axios.get(`/api/rankings/jobs/${id}`).then(response => {
      setRankings(response.data)
    });
  }, [])

  const showRanking = (id) => {
    history.push("/rankings/ranking/" + id)
  }

  return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableCell>Age Category</TableCell>
              <TableCell>Weapon</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rankings.map(row => (
                <TableRow key={row._id}>
                  <TableCell>{row.ageCategory.name}</TableCell>
                  <TableCell>{row.weapon}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" data-testid="rank" onClick={() => showRanking(row._id)}>View</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
  );
}

export default Rankings;
