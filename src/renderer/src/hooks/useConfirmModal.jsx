import { useState } from 'react';

const useConfirmModal = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const openConfirmModal = (action) => {
        setConfirmAction(() => action);
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmModal(false);
    };

    const handleClose = () => {
        setShowConfirmModal(false);
    };

    return {
        showConfirmModal,
        openConfirmModal,
        handleConfirm,
        handleClose,
    };
};

export default useConfirmModal;
