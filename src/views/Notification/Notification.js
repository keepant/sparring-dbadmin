import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { getNotification } from 'graphql/queries/notification';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';
import { InputNotification, TableNotification } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },

  content: {
    marginTop: theme.spacing(2)
  }
}));

const Notification = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(getNotification);

  if (loading) {
    return <SemipolarLoading />;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  const notification = data.notifications;

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={6} md={6} xl={4} xs={12}>
          <InputNotification />
        </Grid>
        <Grid item lg={6} md={6} xl={8} xs={12}>
          <TableNotification notifications={notification} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Notification;
