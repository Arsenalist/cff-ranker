import React, { useEffect, useState } from 'react';

import { AgeCategory } from '@cff/api-interfaces';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

/* eslint-disable-next-line */
export interface AgeCategoryListProps {}

export function AgeCategoryList() {
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([])
  useEffect(() => {
    console.log("here")
    axios.get('/api/age-category').then(response => {
      setAgeCategories(response.data)
    });
  }, [])
  return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Year of Birth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ageCategories.map(c =>
            <TableRow key={c.code}>
              <TableCell>
                {c.name}
              </TableCell>
              <TableCell>
                {c.code}
              </TableCell>
              <TableCell>
                {c.yearOfBirth}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
}

export default AgeCategoryList;
