import { BusinessRounded, MaleRounded, PersonOutlined, PhoneRounded, SubjectRounded } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, IconButton, Input, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Modal, ModalClose, Option, Select, Sheet, Stack, Textarea, Typography } from '@mui/joy';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import TextMaskAdapter from '../components/TextMaskPhone';
import { setSnackbar } from '../redux/snackbarSlice';

const DateAdd = () => {
    const [open, setOpen] = useState(false);
    const [contactData, setContactData] = useState([]);
    const dispatch = useDispatch();

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const date = `${data.get('date')} ${data.get('time')}`;
        window.db?.insertDate(data.get('name'), data.get('surname'), data.get('gender'), data.get('phone'), date, data.get('requestDate'), data.get('subject'), data.get('business'), data.get('institution'));
        event.target.reset();
        dispatch(setSnackbar({ children: "Randevu ekleme başarılı", color: 'success' }));
    }, [dispatch]);

    const getContactData = useCallback(() => {
        const data = window.db?.readAllPerson();
        setContactData(data);
    }, []);

    const contactOpen = useCallback(() => {
        getContactData();
        setOpen(true);
    }, [getContactData]);

    const fillFormWithContact = useCallback((item) => {
        console.log(item);
        if (item) {
            const { ad, soyad, cinsiyet, telefon, kurum } = item;
            const defaultValues = { name: ad, surname: soyad, gender: cinsiyet, phone: telefon, business: kurum };
            const form = document.querySelector('form');
            Object.keys(defaultValues).forEach(key => {
                const input = form.elements[key];
                if (input) input.value = defaultValues[key];
            });
            setOpen(false);
        }
    }, []);

    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ position: 'sticky', top: { sm: -100, md: -110 }, bgcolor: 'background.body', px: { xs: 2, md: 6 } }}>
                <Typography level="h2" component="h1" textAlign="center" sx={{ mt: 1, mb: 2 }}>
                    Randevu Ekle
                </Typography>
            </Box>
            <Stack spacing={4} sx={{ display: 'flex', maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 } }}>
                <Card>
                    <Stack direction="row" sx={{ mb: 1 }}>
                        <Box>
                            <Typography level="title-md">Kişisel Bilgiler</Typography>
                            <Typography level="body-sm">Randevu oluşturmak için lütfen kişisel bilgileri girin.</Typography>
                        </Box>
                        <IconButton color='primary' variant='soft' sx={{ ml: 'auto', px: 2 }} onClick={contactOpen}>
                            <PersonOutlined />
                        </IconButton>
                    </Stack>
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Ad Soyad</FormLabel>
                                    <Input size="sm" placeholder='Ad' name="name" />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel> </FormLabel>
                                    <Input
                                        size="sm"
                                        placeholder="Soyad"
                                        name="surname"
                                        sx={{ flexGrow: 1 }}
                                    />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 1.2 }}>
                                    <FormLabel>Cinsiyet</FormLabel>
                                    <Select
                                        placeholder="Cinsiyet Seçin"
                                        name="gender"
                                        startDecorator={<MaleRounded />}
                                        required
                                        sx={{ minWidth: 175 }}>
                                        <Option value="Erkek">Erkek</Option>
                                        <Option value="Kadın">Kadın</Option>
                                        <Option value="Bilinmiyor">Bilinmiyor</Option>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Telefon</FormLabel>
                                    <Input
                                        size="sm"
                                        startDecorator={<PhoneRounded />}
                                        placeholder="Telefon"
                                        name='phone'
                                        sx={{ flexGrow: 1 }}
                                        slotProps={{ input: { component: TextMaskAdapter } }}
                                    />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 0.8 }}>
                                    <FormLabel>Randevu Tarihi</FormLabel>
                                    <Input
                                        type="date"
                                        defaultValue={dayjs().format('YYYY-MM-DD')}
                                        name='date'
                                    />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel> </FormLabel>
                                    <Input
                                        type="time"
                                        name='time'
                                        defaultValue={dayjs().format('HH:mm')}
                                    />
                                </FormControl>
                            </Stack>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Talep Tarihi</FormLabel>
                                <Input
                                    type="date"
                                    name='requestDate'
                                    defaultValue={dayjs().format("YYYY-MM-DD")}
                                />
                            </FormControl>
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 1.2 }}>
                                    <FormLabel>Randevu Konusu</FormLabel>
                                    <Input
                                        size="sm"
                                        name="subject"
                                        startDecorator={<SubjectRounded />}
                                        placeholder="Randevu Konusu"
                                        sx={{ flexGrow: 1 }}
                                    />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Kurumu</FormLabel>
                                    <Input
                                        size="sm"
                                        name="business"
                                        startDecorator={<BusinessRounded />}
                                        placeholder="Kurumu"
                                        sx={{ flexGrow: 1 }}
                                    />
                                </FormControl>
                            </Stack>
                            <FormControl sx={{ pb: 2 }}>
                                <FormLabel>Açıklama</FormLabel>
                                <Textarea name='institution' placeholder="Açıklama..." minRows={4} />
                            </FormControl>
                        </Stack>

                        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                                <Button size="sm" type='submit' variant="solid" sx={{ width: 100 }}>
                                    Ekle
                                </Button>
                            </CardActions>
                        </CardOverflow>
                    </form>
                </Card>
            </Stack>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Rehber
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 4,
                            px: 2,
                        }}
                    >
                        <List
                            aria-labelledby="ellipsis-list-demo"
                            sx={{ '--ListItemDecorator-size': '56px' }}
                        >
                            {contactData != "" ? contactData.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemButton onClick={() => fillFormWithContact(item)}>
                                            <ListItemDecorator>
                                                <Avatar color='primary'>{item.ad.charAt(0)}{item.soyad.charAt(0)}</Avatar>
                                            </ListItemDecorator>
                                            <ListItemContent>
                                                <Typography level="title-sm">{item.ad} {item.soyad} </Typography>
                                                <Typography level="body-sm" noWrap>
                                                    {item.telefon} <Typography sx={{ ml: 3 }} color='primary'>{item.kurum}</Typography>
                                                </Typography>
                                            </ListItemContent>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListDivider inset="gutter" />
                                </React.Fragment>
                            )) : <Typography>Rehberiniz Boş</Typography>
                            }
                        </List>
                    </Box>
                </Sheet>
            </Modal>
        </Box>
    )
}

export default DateAdd