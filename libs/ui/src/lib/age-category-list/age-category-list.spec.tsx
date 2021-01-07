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

function verifyRecordIsNotInDocument(record: AgeCategory) {
  expect(screen.queryByText(record.name)).toBeNull();
  expect(screen.queryByText(record.code)).toBeNull();
  expect(screen.queryByText(record.yearOfBirth)).toBeNull();
}

describe('AgeCategoryList - edit and save', () => {
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
  it('edit and save a record', async () => {
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

describe('AgeCategoryList - delete', () => {
  beforeEach(() => {
    mock.reset()
    mock.onGet('/api/age-category').replyOnce(200, [
      record1,
      record2
    ]).onGet('/api/age-category').replyOnce(200, [
      record1
    ]).onDelete('/api/age-category').reply(200);
  })
  it('should delete an age category', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
    await act(async () => {
      await userEvent.click(screen.getByTestId("delete-button-2"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsNotInDocument(record2)
  });
});

describe('AgeCategoryList - add a record', () => {
  beforeEach(() => {
    mock.reset()
    mock.onGet('/api/age-category').replyOnce(200, [
      record1
    ]).onGet('/api/age-category').replyOnce(200, [
      record1,
      record2
    ]).onPut('/api/age-category').reply(200);
  })
  it('should add an age category', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsNotInDocument(record2)
    await act(async () => {
      await userEvent.click(screen.getByTestId("add-button"));
      await fireEvent.change(screen.getByTestId("name"), {target: {value: record2.name}});
      await fireEvent.change(screen.getByTestId("code"), {target: {value: record2.code}});
      await fireEvent.change(screen.getByTestId("yearOfBirth"), {target: {value: record2.yearOfBirth}});
      await userEvent.click(screen.getByTestId("add-button-confirm"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
  });
});
