import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import {
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import { CircleToBlockLoading } from 'react-loadingg';
import { useMutation } from '@apollo/react-hooks';
import { verifyOwner, notVerifyOwner } from 'graphql/mutations/owner';
import { getAllOwners } from 'graphql/queries/owner';
import { sendVerifyNotif } from 'graphql/mutations/notification';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  iconBtn: {
    colorPrimary: colors.green[600],
    colorSecondary: colors.red[500]
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const BtnInfo = withStyles(theme => ({
    root: {
      color: theme.palette.getContrastText(colors.blue[600]),
      backgroundColor: colors.blue[600],
      '&:hover': {
        backgroundColor: colors.blue[900]
      }
    }
  }))(Button);

  const [urlId, setUrlId] = useState('');
  const [urlPhoto, setUrlPhoto] = useState('');
  const [urlWithId, setUrlWithId] = useState('');
  const [showId, setShowId] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showWithId, setShowWithId] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openNot, setOpenNot] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFailed, setAlertFailed] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenNot = () => {
    setOpenNot(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenNot(false);
  };

  const [toggleVerifiedOwner] = useMutation(verifyOwner);
  const [toggleNotVerified] = useMutation(notVerifyOwner);

  var sendNotificationOwneer = function(data) {
    var headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic NjIyN2I2NmItMTI0My00NmJiLTlmODMtMDUxNjJhNjA4Yjdj'
    };

    var options = {
      host: 'onesignal.com',
      port: 443,
      path: '/api/v1/notifications',
      method: 'POST',
      headers: headers
    };

    var https = require('https');
    var req = https.request(options, function(res) {
      res.on('data', function(data) {
        console.log('Response:');
        console.log(JSON.parse(data));
      });
    });

    req.on('error', function(e) {
      console.log('ERROR:');
      console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
  };

  const [sendNotif] = useMutation(sendVerifyNotif);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      {loading && <CircleToBlockLoading />}
      <Collapse in={alertSuccess}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertSuccess(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Owner verified!
        </Alert>
      </Collapse>
      <Collapse in={alertFailed}>
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                setAlertFailed(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Owner data refused!
        </Alert>
      </Collapse>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registration date</TableCell>
                  <TableCell>ID Card</TableCell>
                  <TableCell>Selfie</TableCell>
                  <TableCell>Selfie With ID</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    selected={selectedUsers.indexOf(user.id) !== -1}>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{user.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {moment(user.created_at).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const storage = firebase.storage().ref();

                          storage
                            .child('verify/' + user.owner_doc.id_card)
                            .getDownloadURL()
                            .then(url => setUrlId(url));
                          setShowId(true);
                          setLoading(true);
                        }}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      {showId && (
                        <Lightbox
                          image={urlId}
                          title="ID Card (KTP)"
                          onClose={() => {
                            setShowId(false);
                            setLoading(false);
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const storage = firebase.storage().ref();

                          storage
                            .child('verify/' + user.owner_doc.photo)
                            .getDownloadURL()
                            .then(url => setUrlPhoto(url));
                          setShowPhoto(true);
                          setLoading(true);
                        }}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      {showPhoto && (
                        <Lightbox
                          image={urlPhoto}
                          title="Photo selfie"
                          onClose={() => {
                            setShowPhoto(false);
                            setLoading(false);
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {' '}
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const storage = firebase.storage().ref();

                          storage
                            .child('verify/' + user.owner_doc.selfie_with_id)
                            .getDownloadURL()
                            .then(url => setUrlWithId(url));
                          setShowWithId(true);
                          setLoading(true);
                        }}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      {showWithId && (
                        <Lightbox
                          image={urlWithId}
                          title="Photo With ID Card"
                          onClose={() => {
                            setShowWithId(false);
                            setLoading(false);
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.account_status === 'process' && (
                        <div>
                          {console.log(user.id)}
                          <IconButton
                            aria-label="verify"
                            onClick={handleClickOpen}
                            className={classes.iconBtn}>
                            <CheckCircleIcon
                              style={{ color: colors.green[600] }}
                            />
                          </IconButton>
                          <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description">
                            <DialogTitle id="alert-dialog-slide-title">
                              {'Are you sure to verify ' + user.name + '?'}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-slide-description">
                                Verifying this data means you acknowledge that
                                this data is valid.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={handleClose}
                                style={{ color: colors.red[600] }}>
                                No
                              </Button>
                              <Button
                                onClick={() => {
                                  console.log(user.id);
                                  toggleVerifiedOwner({
                                    variables: {
                                      id: user.id
                                    },
                                    optimisticResponse: true,
                                    update: cache => {
                                      const exitingOwner = cache.readQuery({
                                        query: getAllOwners
                                      });
                                      const newOwner = exitingOwner.owners.map(
                                        t => {
                                          if (t.id === user.id) {
                                            return {
                                              ...t,
                                              account_status: 'verified'
                                            };
                                          } else {
                                            return t;
                                          }
                                        }
                                      );
                                      cache.writeQuery({
                                        query: getAllOwners,
                                        data: { owners: newOwner }
                                      });
                                    }
                                  });
                                  setOpen(false);
                                  setOpenNot(false);
                                  setAlertSuccess(true);

                                  let title = 'Your account is verified!';
                                  let content = 'Congratulations! Your account successfully verified. Now you can freely use our app feature.';

                                  sendNotif({
                                    variables: {
                                      title: title,
                                      content: content,
                                      segment: user.id
                                    }
                                  });

                                  let message = {
                                    app_id:
                                      '8e178fec-85ba-4f81-98c2-84cf1ecc954c',
                                    headings: { en: title },
                                    contents: { en: content },
                                    include_external_user_ids: [user.id]
                                  };
                                  sendNotificationOwneer(message);
                                }}
                                style={{ color: colors.green[600] }}>
                                Yes
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <IconButton
                            aria-label="not"
                            onClick={handleClickOpenNot}
                            className={classes.iconBtn}>
                            <CancelRoundedIcon
                              style={{ color: colors.red[600] }}
                            />
                          </IconButton>
                          <Dialog
                            open={openNot}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description">
                            <DialogTitle id="alert-dialog-slide-title">
                              {'Are you sure to refuse data ' + user.name + '?'}
                            </DialogTitle>
                            <DialogActions>
                              <Button
                                onClick={handleClose}
                                style={{ color: colors.red[600] }}>
                                No
                              </Button>
                              <Button
                                onClick={() => {
                                  toggleNotVerified({
                                    variables: {
                                      id: user.id
                                    },
                                    optimisticResponse: true,
                                    update: cache => {
                                      const exitingOwner = cache.readQuery({
                                        query: getAllOwners
                                      });
                                      const newOwner = exitingOwner.owners.map(
                                        t => {
                                          if (t.id === user.id) {
                                            return {
                                              ...t,
                                              account_status: 'not'
                                            };
                                          } else {
                                            return t;
                                          }
                                        }
                                      );
                                      cache.writeQuery({
                                        query: getAllOwners,
                                        data: { owners: newOwner }
                                      });
                                    }
                                  });
                                  setOpenNot(false);
                                  setAlertFailed(true);

                                  let title = 'Oh no! Your accout failed to verify.';
                                  let content = 'Your account currently cannot be verifed. But you can try to verified your account again any time.';

                                  sendNotif({
                                    variables: {
                                      title: title,
                                      content: content,
                                      segment: user.id
                                    }
                                  });

                                  let message = {
                                    app_id:
                                      '8e178fec-85ba-4f81-98c2-84cf1ecc954c',
                                    headings: { en: title },
                                    contents: { en: content },
                                    include_external_user_ids: [user.id]
                                  };
                                  sendNotificationOwneer(message);
                                }}
                                style={{ color: colors.green[600] }}>
                                Yes
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      )}

                      {user.account_status === 'verified' && (
                        <IconButton
                          aria-label="verify"
                          className={classes.iconBtn}
                          disabled>
                          <CheckCircleIcon
                            style={{ color: colors.green[600] }}
                          />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
