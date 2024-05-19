import { Button, DialogTitle, FormControl, FormLabel, List, ListItem, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy';
import React from 'react';

const ExcelDataModal = () => {
    const [layout, setLayout] = React.useState(undefined);
    return (
        <React.Fragment>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => {
                        setLayout('center');
                    }}
                >
                    Center
                </Button>
                <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => {
                        setLayout('fullscreen');
                    }}
                >
                    Full screen
                </Button>
            </Stack>
            <Modal
                open={!!layout}
                onClose={() => {
                    setLayout(undefined);
                }}
            >
                <ModalDialog layout={layout}>
                    <ModalClose />
                    <DialogTitle>Vertical scroll example</DialogTitle>
                    <FormControl
                        orientation="horizontal"
                        sx={{ bgcolor: 'background.level2', p: 1, borderRadius: 'sm' }}
                    >
                        <FormLabel>Container overflow</FormLabel>
                    </FormControl>
                    <List
                        sx={{
                            overflow: 'scroll',
                            mx: 'calc(-1 * var(--ModalDialog-padding))',
                            px: 'var(--ModalDialog-padding)',
                        }}
                    >
                        {[...Array(100)].map((item, index) => (
                            <ListItem key={index}>I&apos;m in a scrollable area.</ListItem>
                        ))}
                    </List>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}

export default ExcelDataModal