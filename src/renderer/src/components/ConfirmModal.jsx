import { WarningRounded } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy';
import React from 'react';

const ConfirmModal = ({ open, handleClose, handleDeleteItem }) => {
    return (
        <Modal open={open} onClose={handleClose} sx={{ zIndex: 10000 }}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <WarningRounded fontSize="large" color="danger" />
                    Onay
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Bu işlemin geri dönüşü yok, bunu yapmak istediğine emin misin?
                </DialogContent>
                <DialogActions>
                    <Button variant="soft" color="danger" onClick={handleDeleteItem} sx={{ minWidth: 80 }}>
                        Sil
                    </Button>
                    <Button variant="outlined" onClick={handleClose}>
                        İptal
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}

export default ConfirmModal