import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router'
import styled from 'styled-components';
import {Ranking as RankingObject } from '@cff/api-interfaces'
import axios from 'axios';
import { Chip, TableBody, TableContainer, Paper, Table, TableHead, TableRow, TableCell } from '@material-ui/core';

export function Ranking() {
  const { id } = useParams()
  const [ranking, setRanking] = useState<RankingObject>()

  useEffect(() => {
    axios.get(`/api/rankings/ranking/${id}`).then(response => {
      setRanking(response.data)
    });
  }, [])


  return (
    <>
      {ranking &&
      <>
        <Chip
          variant="outlined"
          label={ranking.ageCategory.name}
        />
        <Chip
          variant="outlined"
          label={ranking.weapon}
        />
        <Chip
          variant="outlined"
          label={ranking.gender}
        />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableCell>Name</TableCell>
              <TableCell>CFF Number</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              ranking.ranks.map(row => (
                <TableRow key={row.player._id}>
                  <TableCell>{row.player.firstName} {row.player.lastName}</TableCell>
                  <TableCell>{row.player.cffNumber}</TableCell>
                  <TableCell>{row.points}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      </>
      }
    </>
  );
}

export default Ranking;
