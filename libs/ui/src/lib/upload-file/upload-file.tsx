import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { Chip } from '@material-ui/core';
import { MessagesContext } from '../../../../../apps/ranker/src/app/messages-context';

export function UploadFile(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { addErrors, addMessages } = useContext(MessagesContext);

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
      addErrors(["Please select a file"])
      return
    }
    const formData = new FormData();
    formData.append(
      'uploadedFile',
      selectedFile,
      selectedFile.name
    );
    axios.post(props.endpoint, formData).then(response => {
      addMessages([`${response.data.rowCount} rows uploaded.`])
      props.postUploadHandler(response.data.competition)
    }, function(err) {});
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
