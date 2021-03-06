import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { getCountNotVerifiedOwner } from 'graphql/queries/count';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';

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
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));

const OwerNotVerified = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const { loading, error, data } = useQuery(getCountNotVerifiedOwner);
  
  if(loading) {
    return <SemipolarLoading />
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }  


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              OWNER NOT VERFIED
            </Typography>
            <Typography variant="h3">{data['owners_aggregate']['aggregate']['count']}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CancelIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

OwerNotVerified.propTypes = {
  className: PropTypes.string
};

export default OwerNotVerified;
