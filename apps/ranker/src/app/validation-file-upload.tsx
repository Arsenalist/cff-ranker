import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';

export function ValidationFileUpload(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rowCount, setRowCount] = useState(null);
  const [error, setError] = useState(null);

  function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function onFileUpload() {
    if (!selectedFile) {
      setError("Please select a file.")
      return
    }
    const formData = new FormData();
    formData.append(
      'validationFile',
      selectedFile,
      selectedFile.name
    );
    axios.post(props.endpoint, formData).then(response => {
      setRowCount(response.data.rowCount)
    }).catch(error => {
      if (error.response) {
        setError(error.response.data.message)
      }
    });
  }

  return (
    <div>

      {error
        ? <MuiAlert severity="error"> {error} </MuiAlert>
        : ''
      }
      {rowCount
        ? <MuiAlert severity="success"> {rowCount} rows uploaded.</MuiAlert>
        : ''
      }
      <div>
        <Button
          data-testid="file-select-button"
          variant="contained"
          component="label"
        >
          Select Validation File
          <input
            type="file"
            hidden
            onChange={onFileChange}
          />
        </Button>
        <Button
          variant="contained" color="primary"
          data-testid="upload-button" onClick={onFileUpload}>Upload!</Button>
      </div>
    </div>
  );
}
