import React from 'react';
import AgeCategoryList from './age-category-list';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { AgeCategory } from '@cff/api-interfaces';

const mock = new MockAdapter(require('axios'));
describe('AgeCategoryList', () => {
  const record1: AgeCategory = {
    _id: '1',
    name: 'Senior',
    code: 'senior',
    yearOfBirth: 2020
  };
  const record2: AgeCategory = {
    _id: '2',
    name: 'Junior',
    code: 'junior',
    yearOfBirth: 2019
  };
  const record2Updated: AgeCategory = {
    _id: '2',
    name: 'JuniorEdited',
    code: 'junior-edited',
    yearOfBirth: 2025
  };
  function verifyRecordIsInDocument(record: AgeCategory) {
    expect(screen.getByText(record.name)).toBeInTheDocument();
    expect(screen.getByText(record.code)).toBeInTheDocument();
    expect(screen.getByText(record.yearOfBirth)).toBeInTheDocument();
  }
  beforeEach(() => {
    mock.reset()
    mock.onGet('/api/age-category').replyOnce(200, [
      record1,
      record2
    ]).onGet('/api/age-category').replyOnce(200, [
      record1,
      record2Updated,
    ]).onPost('/api/age-category').reply(200);
  })
  it('should show all age categories', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
  });
  it('category is allowed to be edited', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("edit-button-2"));
      await fireEvent.change(screen.getByTestId("name-2"), {target: {value: record2Updated.name}});
      await fireEvent.change(screen.getByTestId("code-2"), {target: {value: record2Updated.code}});
      await fireEvent.change(screen.getByTestId("yearOfBirth-2"), {target: {value: record2Updated.yearOfBirth}});
      await userEvent.click(screen.getByTestId("save-button-2"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2Updated)
  });
});