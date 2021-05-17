import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, TableContainer, Table, TableBody, Paper, TableRow, TableCell, TableHead } from '@material-ui/core';
import { RankingJob } from '@cff/api-interfaces';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format, isValid, subDays } from 'date-fns';

export function RankingJobs() {
  const history = useHistory();
  const [rankingJobs, setRankingJobs] = useState<RankingJob[]>([])
  const [startDate, startDateChange] = useState(subDays(new Date(), 365));
  const [endDate, endDateChange] = useState(new Date());

  const [reload, setReload] = useState(0)
  useEffect(() => {
    axios.get('/api/rankings/jobs').then(response => {
      setRankingJobs(response.data)
    });
  }, [reload])

  const rank = () => {
    axios.post('/api/rank', {startDate: startDate, endDate: endDate}).then(response => {
      setReload(r => r + 1)
    });
  }

  const showJobDetails = (id) => {
    history.push("/rankings/jobs/" + id)
  }

  const formatDate = (date) =>  {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString()
  }

  const formatRangeDate = (date) =>  {
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd')
    } else {
      return ""
    }
  }

  return (
    <>
      <p>
        Select the date range to use when selecting tournaments to rank.
      </p>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker format="YYY-MM-dd" key="startDate" value={startDate} onChange={startDateChange} />
        <DatePicker format="YYY-MM-dd"  key="endDate" value={endDate} onChange={endDateChange} />
      </MuiPickersUtilsProvider>
      <p>
        <Button variant="contained" color="primary" data-testid="rank-button" onClick={() => rank()}>Create Ranking</Button>
      </p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableCell>User</TableCell>
              <TableCell>Date Generated</TableCell>
              <TableCell>Range</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rankingJobs.map(row => (
                <TableRow key={row._id}>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{formatDate(new Date(row.dateGenerated))}</TableCell>
                  <TableCell>{formatRangeDate(new Date(row.startDate))} - {formatRangeDate(new Date(row.endDate))}</TableCell>
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
