import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import { ValidationFileUpload } from './validation-file-upload';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(require('axios'));

describe('ValidationFileUpload', () => {
  let container = null;
  const endpoint = "/api/upload-file"
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  async function executeUpload() {
    act(() => { render(<ValidationFileUpload endpoint={ endpoint } />, container); });
    await act(async() => {
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
  }

  it('uploads file', async () => {
    mock.onPost(endpoint).reply(200, {rowCount: 100 });
    await executeUpload()
    expect(container.textContent).toContain("100 rows uploaded")
  });

  it('upload failed', async () => {
    mock.onPost(endpoint).reply(500, {message: 'problem with file' });
    await executeUpload()
    expect(container.textContent).toContain("problem with file")
  });

  it('upload without file selection', async () => {
    await act(async() => {
      render(<ValidationFileUpload endpoint={ endpoint }/>, container);
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(container.textContent).toContain("Please select a file.")
  });

});
