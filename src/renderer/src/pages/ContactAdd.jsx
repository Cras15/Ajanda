import { BusinessRounded, MaleRounded, PhoneRounded } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, Input, Option, Select, Stack, Typography } from '@mui/joy';
import React from 'react';
import { useDispatch } from 'react-redux';
import TextMaskAdapter from '../components/TextMaskPhone';
import { setSnackbar } from '../redux/snackbarSlice';

const formStyles = {
    formControl: { flexGrow: 1 },
    stackMain: {
        display: 'flex', maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 }
    },
    submitButton: { width: 100 }
};

const ContactAdd = () => {
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.db?.insertPerson(data.get('name'), data.get('surname'), data.get('gender'), data.get('phone'), data.get('business'));
        event.target.reset();
        dispatch(setSnackbar({ children: "Kişi ekleme başarılı", color: 'success' }));
    };

    const FormControlItem = ({ label, name, placeholder, startDecorator, isSelect = false, options = [], component }) => (
        <FormControl sx={formStyles.formControl}>
            <FormLabel>{label}</FormLabel>
            {!isSelect ? (
                <Input
                    size="sm"
                    startDecorator={startDecorator}
                    placeholder={placeholder}
                    name={name}
                    sx={{ flexGrow: 1 }}
                    slotProps={component ? { input: { component } } : undefined}
                />
            ) : (
                <Select
                    placeholder={placeholder}
                    name={name}
                    startDecorator={startDecorator}
                    required
                    sx={{ minWidth: 175 }}
                >
                    {options.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                </Select>
            )}
        </FormControl>
    );

    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ position: 'sticky', top: { sm: -100, md: -110 }, bgcolor: 'background.body' }}>
                <Typography level="h2" component="h1" textAlign="center" sx={{ mt: 1, mb: 2 }}>
                    Kişi Ekle
                </Typography>
            </Box>
            <Stack spacing={4} sx={formStyles.stackMain}>
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Kişisel Bilgiler</Typography>
                        <Typography level="body-sm">Randevu oluşturmak için lütfen kişisel bilgileri girin.</Typography>
                    </Box>
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} sx={{ flexGrow: 1, mb: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <FormControlItem label="Ad" name="name" placeholder="Ad" />
                                <FormControlItem label=" " name="surname" placeholder="Soyad" />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <FormControlItem label="Cinsiyet" name="gender" placeholder="Cinsiyet Seçin" startDecorator={<MaleRounded />} isSelect={true} options={[{ value: "Erkek", label: "Erkek" }, { value: "Kadın", label: "Kadın" }, { value: "Bilinmiyor", label: "Bilinmiyor" }]} />
                                <FormControlItem label="Telefon" name="phone" placeholder="Telefon" startDecorator={<PhoneRounded />} component={TextMaskAdapter} />
                            </Stack>
                            <FormControlItem label="Kurum" name="business" placeholder="Kurum" startDecorator={<BusinessRounded />} />
                        </Stack>
                        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                                <Button size="sm" type='submit' variant="solid" sx={formStyles.submitButton}>
                                    Ekle
                                </Button>
                            </CardActions>
                        </CardOverflow>
                    </form>
                </Card>
            </Stack>
        </Box>
    );
};

export default ContactAdd;
