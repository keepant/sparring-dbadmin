import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { useMutation } from '@apollo/react-hooks';
import { addNotification } from 'graphql/mutations/notification';
//import { getNotification } from 'graphql/queries/notification';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  textField: {
    marginTop: theme.spacing(2)
  }
}));

const schema = {
  title: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  },
  content: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  }
};



const InputFacility = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  // const updateCache = (cache, { data }) => {
  //   const existingFacility = cache.readQuery({
  //     query: getCourtFacilities
  //   });
  //   const newFacility = data.insert_court_facilities.affected_rows[1];
  //   cache.writeQuery({
  //     query: getCourtFacilities,
  //     data: {
  //       court_facilities: [newFacility, ...existingFacility.court_facilities]
  //     }
  //   });
  // };

  const resetInput = () => {
    formState.values.name = '';
  };

  const [addNotif] = useMutation(addNotification, {
    //update: updateCache,
    onCompleted: resetInput
  });

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Notification sended!
        </Alert>
      </Collapse>
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          addNotif({
            variables: {
              title: formState.values.title,
              content: formState.values.content
            }
          });

          setOpen(true);

          formState.values.title = '';
          formState.values.content = '';
        }}>
        <CardHeader subheader="Send notification to app" title="Notification" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                className={classes.textField}
                error={hasError('title')}
                fullWidth
                helperText={
                  hasError('title') ? formState.errors.title[0] : null
                }
                label="Title"
                name="title"
                onChange={handleChange}
                type="title"
                value={formState.values.title || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('content')}
                fullWidth
                helperText={
                  hasError('content') ? formState.errors.content[0] : null
                }
                label="Content"
                name="content"
                onChange={handleChange}
                type="content"
                value={formState.values.content || ''}
                variant="outlined"
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formState.isValid}>
            Send notification
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

InputFacility.propTypes = {
  className: PropTypes.string
};

export default InputFacility;
