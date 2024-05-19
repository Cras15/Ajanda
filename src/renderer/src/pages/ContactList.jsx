import { DeleteOutline } from '@mui/icons-material';
import { Box, Divider, IconButton, Sheet, Table, Typography } from '@mui/joy';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal';
import { setSnackbar } from '../redux/snackbarSlice';

const ContactList = () => {
    const [data, setData] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const dispatch = useDispatch();

    const handleDeletePerson = useCallback(() => {
        setShowConfirmModal(false);
        if (window.db) {
            window.db.deletePerson(selectedId);
            dispatch(setSnackbar({ children: "Kişi başarıyla silindi", color: 'success' }));
            fetchData();
        }
        setSelectedId(null);
    }, [dispatch, selectedId]);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowConfirmModal(true);
    };

    const fetchData = useCallback(() => {
        const newdata = window.db?.readAllPerson();
        setData(newdata);
        console.log(newdata);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <ConfirmModal open={showConfirmModal} handleClose={() => setShowConfirmModal(false)} handleDeleteItem={handleDeletePerson} />
            <Box sx={{ px: { xs: 2, md: 6 } }}>
                <Typography level="h2" component="h1" textAlign="center" sx={{ mt: 1, mb: 2 }}>
                    Rehberim
                </Typography>
                <Divider />
            </Box>
            {data.length > 0 &&
                <Sheet sx={{ maxHeight: 450, overflow: 'auto', maxWidth: '800px', mx: 'auto', mt: 3 }}>
                    <Table hoverRow stickyHeader stickyFooter variant='outlined' sx={{ borderRadius: 'sm' }}>
                        <thead>
                            <tr>
                                <th>Ad Soyad</th>
                                <th>Cinsiyet</th>
                                <th>Telefon</th>
                                <th>Kurum</th>
                                <th style={{ width: '10%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.ad} {item.soyad}</td>
                                    <td>{item.cinsiyet}</td>
                                    <td>{item.telefon}</td>
                                    <td>{item.kurum}</td>
                                    <td>
                                        <IconButton color='danger' variant='plain' onClick={() => handleDeleteClick(item.id)}>
                                            <DeleteOutline />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={1}>Toplam</td>
                                <td colSpan={4}>{data.length} kişi</td>
                            </tr>
                        </tfoot>
                    </Table>
                </Sheet>
            }
        </>
    );
}

export default ContactList;
