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
  minimumForce: 30,
  yearOfBirth: 2020
};
const record2: AgeCategory = {
  _id: '2',
  name: 'Junior',
  code: 'junior',
  minimumForce: 40,
  yearOfBirth: 2019
};
const record2Updated: AgeCategory = {
  _id: '2',
  name: 'JuniorEdited',
  code: 'junior-edited',
  minimumForce: 50,
  yearOfBirth: 2025
};

function verifyRecordIsInDocument(record: AgeCategory) {
  expect(screen.getByText(record.name)).toBeInTheDocument();
  expect(screen.getByText(record.code)).toBeInTheDocument();
  expect(screen.getByText(record.yearOfBirth)).toBeInTheDocument();
  expect(screen.getByText(record.minimumForce)).toBeInTheDocument();
}

function verifyRecordIsNotInDocument(record: AgeCategory) {
  expect(screen.queryByText(record.name)).toBeNull();
  expect(screen.queryByText(record.code)).toBeNull();
  expect(screen.queryByText(record.yearOfBirth)).toBeNull();
  expect(screen.queryByText(record.minimumForce)).toBeNull();
}

async function editInlineRecordButDoNotSave(record: AgeCategory) {
  await userEvent.click(screen.getByTestId(`edit-button-${record._id}`));
  await fireEvent.change(screen.getByTestId(`name-${record._id}`), {target: {value: record.name}});
  await fireEvent.change(screen.getByTestId(`code-${record._id}`), {target: {value: record.code}});
  await fireEvent.change(screen.getByTestId(`yearOfBirth-${record._id}`), {target: {value: record.yearOfBirth}});
  await fireEvent.change(screen.getByTestId(`minimumForce-${record._id}`), {target: {value: record.minimumForce}});
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
      await editInlineRecordButDoNotSave(record2Updated)
      await userEvent.click(screen.getByTestId("save-button-2"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2Updated)
  });
  it('want to edit but changes mind', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
    await act(async () => {
      await editInlineRecordButDoNotSave(record2Updated)
      await userEvent.click(screen.getByTestId("cancel-button-2"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
    verifyRecordIsNotInDocument(record2Updated)
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
      await fireEvent.change(screen.getByTestId("minimumForce"), {target: {value: record2.minimumForce}});
      await userEvent.click(screen.getByTestId("add-button-confirm"));
    });
    verifyRecordIsInDocument(record1)
    verifyRecordIsInDocument(record2)
  });
});
