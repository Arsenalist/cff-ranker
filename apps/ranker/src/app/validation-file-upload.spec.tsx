import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import { ValidationFileUpload } from './validation-file-upload';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mock = new MockAdapter(require('axios'));

describe('ValidationFileUpload', () => {
  let container = null;
  const endpoint = "/api/upload-file"
  let postUploadHandler
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    postUploadHandler = jest.fn()
  });
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  async function executeUpload() {
    act(() => { render(<ValidationFileUpload postUploadHandler={postUploadHandler} endpoint={ endpoint } />, container); });
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
      render(<ValidationFileUpload postUploadHandler={postUploadHandler}  endpoint={ endpoint }/>, container);
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(container.textContent).toContain("No file selected")
    expect(postUploadHandler).not.toHaveBeenCalled()
  });

});
