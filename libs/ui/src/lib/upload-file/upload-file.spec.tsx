import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import { UploadFile } from '@cff/ui';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

const mock = new MockAdapter(require('axios'));

describe('UploadFile', () => {
  const endpoint = "/api/upload-file"
  let postUploadHandler
  beforeEach(() => {
    postUploadHandler = jest.fn()
  });
  async function executeUpload() {
    act(() => { render(<UploadFile postUploadHandler={postUploadHandler} endpoint={ endpoint } />); });
    await act(async() => {
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
  }

  it('uploads file', async () => {
    mock.onPost(endpoint).reply(200, {rowCount: 100 });
    await executeUpload()
    expect(postUploadHandler).toHaveBeenCalledTimes(1)
  });

  it('upload failed', async () => {
      mock.onPost(endpoint).reply(500, {message: 'problem with file' });
      await executeUpload()
      expect(postUploadHandler).not.toHaveBeenCalled()
  });

  it('upload without file selection', async () => {
    await act(async() => {
      render(<UploadFile postUploadHandler={postUploadHandler} endpoint={ endpoint }/>);
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(screen.getByText(/No file selected/i)).toBeInTheDocument();
    expect(postUploadHandler).not.toHaveBeenCalled()
  });

  it('pre-handler is called', async () => {
    const preUploadHandler = jest.fn()
    act(() => { render(<UploadFile preUploadHandler={preUploadHandler}  postUploadHandler={postUploadHandler} endpoint={ endpoint } />); });
    await act(async() => {
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(preUploadHandler).toHaveBeenCalled()
  });

  it('when validate fails, no file upload happens', async () => {
    const validate = jest.fn().mockReturnValue(false)
    act(() => { render(<UploadFile validate={validate}  postUploadHandler={postUploadHandler} endpoint={ endpoint } />); });
    await act(async() => {
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(postUploadHandler).not.toHaveBeenCalled()
  });
});
