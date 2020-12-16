import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Competition, CompetitionResults } from '@cff/api-interfaces';
import axios from 'axios';
import { List, ListItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';

/* eslint-disable-next-line */
export interface CompetitionListProps {}

const StyledCompetitionList = styled.div`
  color: pink;
`;

export function CompetitionList(props: CompetitionListProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  useEffect(() => {
    axios.get('/api/competition').then(response => {
      setCompetitions(response.data)
    });
  }, []);

  return (
    <List>
      {competitions && competitions.map((row: Competition) =>
      <ListItem>
        <ListItemText primary={row.name} secondary={row.code} />
      </ListItem>
      )}
    </List>
  );
}

export default CompetitionList;
