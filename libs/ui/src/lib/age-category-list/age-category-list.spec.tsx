import React from 'react';
import AgeCategoryList from './age-category-list';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';

const mock = new MockAdapter(require('axios'));
describe('AgeCategoryList', () => {
  beforeEach(() => {
    mock.reset()
    mock.onGet('/api/age-category').replyOnce(200, [
      {
        _id: '1',
        name: 'Senior',
        code: 'senior',
        yearOfBirth: 2020
      },
      {
        _id: '2',
        name: 'Junior',
        code: 'junior',
        yearOfBirth: 2019
      }

    ]).onGet('/api/age-category').replyOnce(200, [
      {
        _id: '1',
        name: 'Senior',
        code: 'senior',
        yearOfBirth: 2020
      },
      {
        _id: '2',
        name: 'JuniorEdited',
        code: 'junior-edited',
        yearOfBirth: 2025
      },
    ]).onPost('/api/age-category').reply(200);
  })
  it('should show all age categories', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    expect(screen.getByText(/Senior/)).toBeInTheDocument();
    expect(screen.getByText(/senior/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/Junior/)).toBeInTheDocument();
    expect(screen.getByText(/junior/)).toBeInTheDocument();
    expect(screen.getByText(/2019/)).toBeInTheDocument();
  });
  it('category is allowed to be edited', async () => {
    await act(async () => {
      render(<MemoryRouter><AgeCategoryList/></MemoryRouter>);
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("edit-button-2"));
      await fireEvent.change(screen.getByTestId("name-2"), {target: {value: "JuniorEdited"}});
      await fireEvent.change(screen.getByTestId("code-2"), {target: {value: "juniorEdited"}});
      await fireEvent.change(screen.getByTestId("yearOfBirth-2"), {target: {value: "2025"}});
      await userEvent.click(screen.getByTestId("save-button-2"));
    });
    expect(screen.getByText(/Senior/)).toBeInTheDocument();
    expect(screen.getByText(/senior/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/JuniorEdited/)).toBeInTheDocument();
    expect(screen.getByText(/junior-edited/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });
});
