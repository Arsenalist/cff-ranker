import React from 'react';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { EditParticipant } from '@cff/ui';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

const mock = new MockAdapter(require('axios'));

describe('<EditParticipant/>', () => {
  it('name is shown in edit view', async () => {
    mock.onGet("/api/participant/cid/pid").reply(200, {name: "bob", surname: "jim" });
    await act(async () => {
      render(<EditParticipant competitionId="cid" participantId="pid" />);
    });
    expect(screen.getByText(/bob jim/i)).toBeInTheDocument();
  });

  it('save is called', async () => {
    mock.onGet("/api/participant/cid/pid").reply(200, {name: "bob", surname: "jim" });
    mock.onPost("/api/participant/cid/pid", {cffNumber: "123456"}).reply(200);
    const save = jest.fn()
    await act(async () => {
      render(<EditParticipant competitionId="cid" participantId="pid" onSave={save}/>);
      await fireEvent.change(screen.getByTestId("cffNumber"), {target: {value: "123456"}})
      await userEvent.click(screen.getByTestId("save-button"));
    });
    expect(save).toBeCalledTimes(1)
  });

  it('cancel is called', async () => {
    mock.onGet("/api/participant/cid/pid").reply(200, {name: "bob", surname: "jim" });
    const cancel = jest.fn()
    await act(async () => {
      render(<EditParticipant competitionId="cid" participantId="pid" onCancel={cancel}/>);
      await userEvent.click(screen.getByTestId("cancel-button"));
    });
    expect(cancel).toBeCalledTimes(1)
  });
});
