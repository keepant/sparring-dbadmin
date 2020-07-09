import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import { getAllOwners } from 'graphql/queries/owner';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const OwnerList = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(getAllOwners);

  if (loading) {
    return <SemipolarLoading />;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  const users = data.owners;

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default OwnerList;
