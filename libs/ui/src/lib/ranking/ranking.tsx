import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router'
import { Ranking as RankingObject, ZoneDistribution } from '@cff/api-interfaces';
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

  const showDistribution = (distribution: ZoneDistribution) => {
    return <div>
      {distribution.points} {distribution.competitions.map(c => (
      `(${c.code} = ${c.points}) `
    ))}
    </div>
  }
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
              <TableCell>CFF</TableCell>
              <TableCell>Regional</TableCell>
              <TableCell>National</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              ranking.ranks.map(row => (
                <TableRow key={row.player._id}>
                  <TableCell>{row.player.firstName} {row.player.lastName}</TableCell>
                  <TableCell>{row.player.cffNumber}</TableCell>
                  <TableCell>{row.points}</TableCell>
                  <TableCell>{showDistribution(row.cffDistribution)}</TableCell>
                  <TableCell>{showDistribution(row.regionalDistribution)}</TableCell>
                  <TableCell>{showDistribution(row.nationalDistribution)}</TableCell>
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
