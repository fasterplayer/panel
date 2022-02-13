import React, { useState } from 'react';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import deleteServer from '@/api/admin/servers/deleteServer';
import { TrashIcon } from '@heroicons/react/outline';
import { useServerFromRoute } from '@/api/admin/server';
import { useHistory } from 'react-router-dom';

export default () => {
    const history = useHistory();
    const [ visible, setVisible ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const { data: server } = useServerFromRoute();

    const {
        clearFlashes,
        clearAndAddHttpError,
    } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const onDelete = () => {
        if (!server) return;

        setLoading(true);
        clearFlashes('server');

        deleteServer(server.id)
            .then(() => history.push('/admin/servers'))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'server', error });

                setLoading(false);
                setVisible(false);
            });
    };

    if (!server) return null;

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'Delete server?'}
                buttonText={'Yes, delete server'}
                onConfirmed={onDelete}
                showSpinnerOverlay={loading}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this server?
            </ConfirmationModal>
            <Button
                type={'button'}
                size={'small'}
                color={'red'}
                onClick={() => setVisible(true)}
                css={tw`flex items-center justify-center`}
            >
                <TrashIcon css={tw`w-5 h-5 mr-2`}/> Delete Server
            </Button>
        </>
    );
};