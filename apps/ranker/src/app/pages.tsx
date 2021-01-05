import { UploadFile } from '@cff/ui';
import React, { useState } from 'react';
import { DataGrid, ValueFormatterParams, ValueGetterParams } from '@material-ui/data-grid';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from "react-router-dom";
export function ValidateFileUploadPage() {
  return (
    <div>
      <p>
        Please specify a validation file.
      </p>
      <UploadFile endpoint = "/api/upload-validation-file"/>
    </div>
  )
}

export function ClassificationUploadPage() {
  return (
    <div>
      <p>
        Please specify a classification file.
      </p>
      <UploadFile endpoint = "/api/upload-classification-file"/>
    </div>
  )
}

export function Home() {
  return (<img src="https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/35/1504271735-umathurman-killbill.jpg"/>)
}

export function RankingsHistory() {
  const history = useHistory();
  function handleViewRanking() {
    history.push("/view-ranking/blah");
  }
  const rows = [
    {id: "a", name: "Maggie Kuala", date: "Jan 20, 2020 3:54 PM"},
    {id: "b", name: "Samir Samurai", date: "Jan 15, 2020 1:14 PM"},
    {id: "c", name: "Jamie Jaguar", date: "Nov 14, 2019 10:19 AM"}
  ]
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1},
    { field: 'date', headerName: 'Date', flex: 1},
    { field: 'view', headerName: 'View Ranking', flex: 1,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleViewRanking}
          >
            View Rankings
          </Button>
        </strong>
      )
    }
  ]
  return (<div>
    <h3>National Rankings - fleuret, all ages</h3>
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} disableSelectionOnClick hideFooter  />
    </div></div>)
}
export function SingleRankingsPage() {

  const rows = [
    {id: "a", name: "James", surname: "Avocado", points: 85.2, rank: 1},
    {id: "b", name: "Fred", surname: "Pepper", points: 78.3, rank: 2},
    {id: "c", name: "Amy", surname: "Mayo", points: 65.3, rank: 3},
    {id: "d", name: "Sam", surname: "Ketchup", points: 65.1, rank: 4},
    {id: "e", name: "Bob", surname: "Heinz", points: 56.4, rank: 5},
    {id: "f", name: "Wendy", surname: "Jefferson", points: 39.7, rank: 6}
  ]
  const columns = [
    { field: 'rank', headerName: 'Name', flex: 1},
    { field: 'name', valueGetter: (params: ValueGetterParams) => `${params.getValue('name')}  ${params.getValue('surname')}`, headerName: 'Name', flex: 1},
    { field: 'points', headerName: 'Points', flex: 1}
  ]
  return (<div>
    <h3>National Rankings - fleuret, all ages</h3>
    <h5>Generated on January 3, 2021 8:32 PM</h5>
    <div style={{ height: 500, width: '100%' }}>
    <DataGrid rows={rows} columns={columns} disableSelectionOnClick hideFooter  />
  </div></div>)
}
export function ViewRankingsPage() {
  const [open, setOpen] = useState(false)

  const history = useHistory();
  function handleViewRanking() {
    history.push("/view-ranking/blah");
  }
  function handleViewRankingHistory() {
    history.push("/view-ranking-history/blah");
  }

  const rows = [
    { id: "a", criteriaDescription: 'Ontario Rankings', lastGeneratedTimestamp: 'Jan 5, 2021 6:42 PM'},
    { id: "b", criteriaDescription: 'National Rankings - fleuret, all ages', lastGeneratedTimestamp: 'Jan 5, 2021 6:42 PM'},
    { id: "c", criteriaDescription: 'National Rankings - fleuret, senior', lastGeneratedTimestamp: 'Jan 1, 2021 8:13 AM'}
  ];
  const columns = [
    { field: 'criteriaDescription', headerName: 'Criteria', flex: 1.5},
    { field: 'lastGeneratedTimestamp', headerName: 'Last Generated', flex: 1},
    {
      field: 'generate',
      flex: 0.75,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleViewRanking}
          >
            View Latest
          </Button>
        </strong>
      ),
      headerName: 'Latest'
    },
    {
      field: 'generate',
      flex: 0.75,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button
            variant="outlined"
            color="primary"
            size="small"
          >
            Generate
          </Button>
        </strong>
      ),
      headerName: 'Generate'
    },
    {
      field: 'generate',
      flex: 0.75,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleViewRankingHistory}
          >
            View History
          </Button>
        </strong>
      ),
      headerName: 'History'
    }

  ];

  return (
    <div>
      <Button type="submit"   onClick={(e) => setOpen(true)} color="primary" data-testid="add-button-confirm" variant="contained">
        Create Ranking Criteria
      </Button>

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} disableSelectionOnClick hideFooter  />
      </div>
      <Dialog open={open}  aria-labelledby="form-dialog-title">
        <form>
          <DialogTitle >Create Ranking</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              inputProps={{ "data-testid": "name" }}
              label="Description"
              name="name"
              type="text"
              fullWidth
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Weapon</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox  name="gilad" />}
                  label="Fleuret"
                />
                <FormControlLabel
                  control={<Checkbox  name="jason" />}
                  label="eppee"
                />
                <FormControlLabel
                  control={<Checkbox name="antoine" />}
                  label="haturi hanzo"
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Age Categories</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox  name="gilad" />}
                  label="Junior"
                />
                <FormControlLabel
                  control={<Checkbox  name="jason" />}
                  label="Senior"
                />
                <FormControlLabel
                  control={<Checkbox name="antoine" />}
                  label="Cadet"
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Zone</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox  name="gilad" />}
                  label="West"
                />
                <FormControlLabel
                  control={<Checkbox  name="jason" />}
                  label="East"
                />
                <FormControlLabel
                  control={<Checkbox name="antoine" />}
                  label="National"
                />
              </FormGroup>
            </FormControl>
          <DialogActions>
            <Button color="primary"  onClick={(e) => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit"   onClick={(e) => setOpen(false)} color="primary" data-testid="add-button-confirm" variant="contained">
              Create
            </Button>
          </DialogActions>
          </DialogContent>
        </form>
      </Dialog>

    </div>
  )
}


