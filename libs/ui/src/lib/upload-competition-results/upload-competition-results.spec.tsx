import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import UploadCompetitionResults from './upload-competition-results';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
const mock = new MockAdapter(require('axios'));
describe('UploadCompetitionResults', () => {
  let competitions
  beforeEach(()=> {
    competitions = [
      {code: 'COMP CODE 1', name: 'COMP NAME 1'},
      {code: 'COMP CODE 2', name: 'COMP NAME 2'}
    ];
    mock.onGet('/api/competition').reply(200, competitions)
    mock.onPost('/api/upload-competition-file').reply(200, {rowCount: 100 })

  })
  it('should competitions in autocomplete box, select one and upload file', async () => {
    await act(async () => {
      render(<UploadCompetitionResults />);
    });
    const autocomplete = screen.getByTestId('competition-code');
    autocomplete.focus()
    const input = within(autocomplete).queryByLabelText('Competition')
    await act(async () => {
      await fireEvent.change(input, { target: { value: competitions[0].name} })
      await fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
      await fireEvent.keyDown(autocomplete, { key: 'Enter' })
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(mock.history.post[0].url).toBe('/api/upload-competition-file')
  });

  it('tried to upload file without selecting competition', async () => {
    await act(async () => {
      render(<UploadCompetitionResults />);
    });
    await act(async () => {
      await userEvent.upload(screen.getByTestId("file-select-button"), new File(['contents'], 'name.csv'));
      await userEvent.click(screen.getByTestId("upload-button"));
    });
    expect(screen.getByText(/Please select a competition/i)).toBeInTheDocument()
  });

});
