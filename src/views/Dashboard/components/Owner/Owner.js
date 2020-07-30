import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { getCountOwners } from 'graphql/queries/count';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    height: '90%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.info.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const Owner = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();
  const [network] = useState(false);
  const { loading, data } = useQuery(getCountOwners);

  if (loading) {
    return <SemipolarLoading />;
  }

  // if (error) {
  //   if (
  //     error.message.includes('GraphQL error: Could not verify JWT: JWSError')
  //   ) {
  //     history.replace('/');
  //   }

  //   if (error.message.includes('Network error: Failed to fetch')) {
  //     setNetwork(true);
  //   }

  //   return <div></div>;
  // }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      {network && <img alt="Logo" src="/images/logos/no-internet.png" />}
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              TOTAL OWNER
            </Typography>
            <Typography variant="h3">
              {data['owners_aggregate']['aggregate']['count']}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <SupervisorAccountIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Owner.propTypes = {
  className: PropTypes.string
};

export default withRouter(Owner);
