import React from 'react';
import { ValidationFileUpload } from './validation-file-upload';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(require('axios'));

describe('ValidationFileUpload', () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('uploads file', async () => {
    mock.onPost('/api/upload-validation-file').reply(200, {rowCount: 100 });
    act(() => { render(<ValidationFileUpload/>, container); });
    const fileInput = document.querySelector(`[data-testid="file-select-button"]`);
    const uploadButton = document.querySelector(`[data-testid="upload-button"]`);
    await act(async() => {
      await fileInput.dispatchEvent(new MouseEvent('change'), {
        bubbles: true,
        files: [new Blob(['file contents'])]
      });
      await uploadButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.textContent).toContain("100 rows uploaded")
  });

  it('upload failed', async () => {
    mock.onPost('/api/upload-validation-file').reply(500, {message: 'problem with file' });
    act(() => { render(<ValidationFileUpload/>, container); });
    const fileInput = document.querySelector(`[data-testid="file-select-button"]`);
    const uploadButton = document.querySelector(`[data-testid="upload-button"]`);
    await act(async() => {
      await fileInput.dispatchEvent(new MouseEvent('change'), {
        bubbles: true,
        files: [new Blob(['file contents'])]
      });
      await uploadButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.textContent).toContain("problem with file")
  });

});
