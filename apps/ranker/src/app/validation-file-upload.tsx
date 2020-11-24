import React, { useEffect, useState } from 'react';

import axios from 'axios';

export class ValidationFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
    
//        this.handleSubmit = this.handleSubmit.bind(this);
      }

      onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
      };

    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
          "validationFile",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
        console.log("sending ", formData)
        axios.post("/api/upload-validation-file", formData);
      };

      render() {
        return (
            <div>
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>Upload!</button>
            </div>
        );
      }
}