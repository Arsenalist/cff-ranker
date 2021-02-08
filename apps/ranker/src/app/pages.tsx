import { UploadFile } from '@cff/ui';
import React from 'react';

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
  return (
    <>
      Welcome to the CFF Ranking App.
    </>
  )
}
