import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {DropzoneArea} from 'material-ui-dropzone';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import replace from 'ramda/src/replace';
import { CircularProgress } from '@material-ui/core';

const styles =  (theme) => ({
    paper: {
        alignSelf: 'flex-start',
    },
    dropzoneParagraph: {
        fontFamily: theme.typography.fontFamily,
    }
});

const UploadRoadmapFileDialog = ({
    onClose,
    classes,
    event,
    uploadRoadmapFile,
}) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            classes={{
                paperWidthXl: classes.paper,
            }}
        >
            <DialogTitle>Nahrát fotky k akci</DialogTitle>
            <DialogContent>
                <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText="Obrázky přetáhněte sem nebo kliknutím vyberte"
                    onChange={setFiles}
                    dropzoneParagraphClass={classes.dropzoneParagraph}
                    filesLimit={300}
                    maxFileSize={10000000}
                />
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={() => {
                            console.log('Upload files', files);
                            setLoading(true);
                            const uploadPromises = map((file) => uploadRoadmapFile({
                                variables: {
                                    eventId: event.id,
                                    file,
                                    fileExt: replace('image/', '')(file.type),
                                }
                            }))(files || []);
                            Promise.all(uploadPromises).then(() => {
                                setLoading(false);
                                enqueueSnackbar('Vsechny soubory nahrany', { variant: 'success' });
                                onClose();
                            });
                        }}
                    >
                        {loading ? <CircularProgress /> : null} Nahrát
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default compose(
    graphql(gql`
        mutation UploadRoadmapFile($file: Upload!, $eventId: ID!, $fileExt: String!) {
            uploadRoadmapFile(file: $file, eventId: $eventId, fileType: PHOTO, fileExt: $fileExt) {
                id
                photos {
                    id
                    name
                    fileType
                    path
                    author {
                        id
                        firstname
                        lastname
                    }
                }
            }
        }
    `, {
        name: 'uploadRoadmapFile',
    }),
    withStyles(styles),
)(UploadRoadmapFileDialog);
