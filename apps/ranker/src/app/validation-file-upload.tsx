import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { Chip } from '@material-ui/core';

export function ValidationFileUpload(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rowCount, setRowCount] = useState(null);
  const [error, setError] = useState(null);

  function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function SelectedFileChip(props) {
    return (<Chip label={props.file
              ? props.file.name
              : 'No file selected'
          } />)
  }

  function onFileUpload() {
    if (!selectedFile) {
      setError("Please select a file.")
      return
    }
    const formData = new FormData();
    formData.append(
      'uploadedFile',
      selectedFile,
      selectedFile.name
    );
    axios.post(props.endpoint, formData).then(response => {
      setRowCount(response.data.rowCount)
      props.postUploadHandler(response.data.competition)
    }).catch(error => {
      if (error.response) {
        setError(error.response.data.message)
      }
    });
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {error
            ? <MuiAlert severity="error"> {error} </MuiAlert>
            : ''
          }
          {rowCount
            ? <MuiAlert severity="success"> {rowCount} rows uploaded.</MuiAlert>
            : ''
          }
        </Grid>
        <Grid item xs={21}>
          <Button
            data-testid="file-select-button"
            variant="contained"
            component="label"
          >
            Select File
            <input
              type="file"
              hidden
              onChange={onFileChange}
            />
          </Button>

          &nbsp; <SelectedFileChip file={selectedFile} />

        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained" color="primary"
            data-testid="upload-button" onClick={onFileUpload}>Upload!</Button>
        </Grid>
      </Grid>
    </div>
  );
}
