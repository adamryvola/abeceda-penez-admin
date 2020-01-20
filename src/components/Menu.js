import React from 'react';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import Mood from '@material-ui/icons/Mood';
import Archive from '@material-ui/icons/Archive';
import ListItemText from '@material-ui/core/ListItemText';
import Subject from '@material-ui/icons/Subject';
import Assessment from '@material-ui/icons/Assessment';
import Work from '@material-ui/icons/Work';
import Message from '@material-ui/icons/Message';
import { withStyles } from '@material-ui/core';
import logo from '../assets/cs-logo.svg';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { all, any, none } from '../utils/permissions';
import Regions from '../constants/Regions';

const styles = theme => ({
    toolbar: {
        ...theme.mixins.toolbar,
        padding: '15px',
    },
    logo: {
        width: '100%',
    },
    nested: {
        paddingLeft: '73px',
    },
});

const Menu = ({ classes, meQuery }) => (
    <div>
        <div className={classes.toolbar}>
            <img src={logo} alt="Abeceda penez logo" className={classes.logo} />
        </div>
        <Divider />
        {meQuery.loading ? null : (
            <List>
                {all(['ADMIN'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Přehled" />
                        </ListItem>
                        <ListItem button component={Link} to="/core-projects">
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Přehled RMKT" />
                        </ListItem>
                        <ListItem button component={Link} to="/teams">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Správa týmů" />
                        </ListItem>
                    </React.Fragment>
                ) : null}
                {any(['ADMIN', 'AGENCY'])(meQuery) ? (
                    <ListItem button component={Link} to="/toolboxes">
                        <ListItemIcon><Work /></ListItemIcon>
                        <ListItemText primary="Toolboxy" />
                    </ListItem>
                ) : null}
                {any(['ADMIN', 'AGENCY', 'CORE_AGENCY'])(meQuery) ? (
                    <ListItem button component={Link} to="/fairs">
                        <ListItemIcon><Mood /></ListItemIcon>
                        <ListItemText primary="Jarmarky" />
                    </ListItem>
                ) : null}
                {all(['ADMIN'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/users">
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Uživatelé" />
                        </ListItem>
                        <ListItem button component={Link} to="/statistics">
                            <ListItemIcon><Assessment /></ListItemIcon>
                            <ListItemText primary="Statistika" />
                        </ListItem>
                    </React.Fragment>
                    ) : null}
                {all(['CORE'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/classrooms-management">
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Třídy" />
                        </ListItem>
                        <ListItem component="span">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Regiony" />
                        </ListItem>
                        <Collapse in timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {map((region) => (
                                    <ListItem
                                        key={region}
                                        button
                                        component={Link}
                                        to={`/core-region/${region}`}
                                        className={classes.nested}
                                    >
                                        <ListItemText primary={region} />
                                    </ListItem>
                                ))(Regions)}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ) : null}
                {none(['AGENCY', 'CORE_AGENCY'])(meQuery) ? (
                    <ListItem button component={Link} to="/forum">
                        <ListItemIcon><Message /></ListItemIcon>
                        <ListItemText primary="Forum" />
                    </ListItem>
                ) : null}
                {any(['ADMIN', 'SUPER_ADMIN', 'CORE'])(meQuery) ? (
                    <ListItem button component={Link} to="/archive">
                        <ListItemIcon><Archive /></ListItemIcon>
                        <ListItemText primary="Archiv" />
                    </ListItem>
                ) : null}
            </List>
        )}
    </div>
);

const meQuery = graphql(gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`, {
    name: 'meQuery'
});

export default compose(
    meQuery,
    withStyles(styles, { withTheme: true }),
)(Menu);
