import { HomeRounded, PaletteRounded, Person, ReplayRounded } from '@mui/icons-material';
import { Box, Button, Divider, FormControl, FormLabel, Grid, IconButton, Input, ListItemDecorator, Switch, Tab, TabList, TabPanel, Tabs, Typography, tabClasses } from '@mui/joy';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lightenColor } from '../Utils';
import { defaultSettings } from '../hooks/defaultSettingsValue';
import { fetchSettings, updateSetting, updateSettings } from '../redux/settingsSlice';
import { setSnackbar } from '../redux/snackbarSlice';

const SettingsPage = () => {
    const color = 'primary';
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const settings = useSelector(state => state.settings);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const submitForm = () => {
        console.log(settings)
        dispatch(updateSettings(settings));
        dispatch(setSnackbar({ children: "Ayarlar kaydedildi!", color: 'success' }));
    }

    useEffect(() => {
        const getSettings = async () => {
            dispatch(fetchSettings());
            console.log(settings);
        };
        getSettings();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Tabs
                size="lg"
                aria-label="Bottom Navigation"
                value={tabIndex}
                onChange={handleTabChange}
                sx={(theme) => ({
                    p: 1,
                    borderRadius: 16,
                    mx: 'auto',
                    boxShadow: theme.shadow.sm,
                    '--joy-shadowChannel': theme.vars.palette[color].darkChannel,
                    [`& .${tabClasses.root}`]: {
                        py: 1,
                        flex: 1,
                        transition: '0.3s',
                        fontWeight: 'md',
                        fontSize: 'md',
                        [`&:not(.${tabClasses.selected}):not(:hover)`]: {
                            opacity: 0.7,
                        },
                    },
                })}
            >
                <TabList
                    variant="plain"
                    size="md"
                    disableUnderline
                    sx={{ borderRadius: 'lg', p: 0, width: '100%' }}
                >
                    <Tab disableIndicator orientation="vertical" color={color}>
                        <ListItemDecorator>
                            <HomeRounded />
                        </ListItemDecorator>
                        Genel
                    </Tab>
                    <Tab disableIndicator orientation="vertical" color={color}>
                        <ListItemDecorator>
                            <PaletteRounded />
                        </ListItemDecorator>
                        Renk
                    </Tab>
                    <Tab disableIndicator orientation="vertical" color={color}>
                        <ListItemDecorator>
                            <Person />
                        </ListItemDecorator>
                        ...
                    </Tab>
                </TabList>
                <TabPanel value={0}>
                    <Box sx={{ p: 2 }}>
                        <Typography level="h5" mb={2}>
                            Yaklaşan Randevu Ayarları
                        </Typography>
                        <Grid container spacing={3} mb={1}>
                            <InputPick title="Yaklaşan Randevu Kaç Saat Kala Gözüksün" setterValue="yaklasan_randevu_saat" type="number" />
                            <InputPick title="Tablo Satır Sayısı" setterValue="tablo_satir_sayisi" type="number" />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Typography level="h5" mb={2}>
                            Randevu Listesi Ayarları
                        </Typography>
                        <Grid container spacing={3} mb={1}>
                            <SwitchPick title="Renksiz Başlık" setterValue="renksiz_baslik" />
                            <SwitchPick title="Renksiz Tablo" setterValue="renksiz_tablo" />
                            <SwitchPick title="Yaklaşan Randevu Uyarı" setterValue="yaklasan_randevu_uyari" />
                        </Grid>
                    </Box>
                    <Divider />
                    <Button sx={{ mt: 2 }} onClick={submitForm} fullWidth size='md'>Kaydet</Button>
                </TabPanel>
                <TabPanel value={1}>
                    <Box sx={{ p: 2 }}>
                        <Typography level="h5" mb={2}>
                            Arka Plan Renkleri
                        </Typography>
                        <Grid container spacing={3} mb={1}>
                            <ColorPick title="Yaklaşan Randevu Rengi" setterValue="yaklasan_randevu_renk" />
                            <ColorPick title="Geçen Randevu Rengi" setterValue="gecen_randevu_renk" />
                            <ColorPick title="Şu Anki Randevu Rengi" setterValue="su_anki_randevu_renk" />
                            {/* Dark Mode*/}
                            <ColorPick title="Koyu Mod Yaklaşan Randevu Rengi" setterValue="yaklasan_randevu_renk_dark" />
                            <ColorPick title="Koyu Mod Geçen Randevu Rengi" setterValue="gecen_randevu_renk_dark" />
                            <ColorPick title="Koyu Mod Şu Anki Randevu Rengi" setterValue="su_anki_randevu_renk_dark" />
                        </Grid>
                        <Divider />
                        <Typography level="h5" mb={2} mt={2}>
                            Yazı Renkleri
                        </Typography>
                        <Grid container spacing={3} mb={1}>
                            <ColorPick title="Yaklaşan Randevu Rengi" setterValue="yaklasan_randevu_yazi_renk" />
                            <ColorPick title="Geçen Randevu Rengi" setterValue="gecen_randevu_yazi_renk" />
                            <ColorPick title="Şu Anki Randevu Rengi" setterValue="su_anki_randevu_yazi_renk" />
                            {/* Dark Mode*/}
                            <ColorPick title="Koyu Mod Yaklaşan Randevu Rengi" setterValue="yaklasan_randevu_yazi_renk_dark" />
                            <ColorPick title="Koyu Mod Geçen Randevu Rengi" setterValue="gecen_randevu_yazi_renk_dark" />
                            <ColorPick title="Koyu Mod Şu Anki Randevu Rengi" setterValue="su_anki_randevu_yazi_renk_dark" />
                        </Grid>
                        <Divider />
                        <Typography level="h5" mb={2} mt={2}>
                            Excel Renkleri
                        </Typography>
                        <Grid container spacing={3} mb={1}>
                            <ColorPick title="Başlık Arka Plan Rengi" setterValue="excel_baslik_arkaplan_renk" />
                            <ColorPick title="Başlık Yazı Rengi" setterValue="excel_baslik_yazi_renk" />
                            <ColorPick title="Gövde Arka Plan Rengi" setterValue="excel_tablo_arkaplan_renk" />
                            <ColorPick title="Gövde Yazı Rengi" setterValue="excel_tablo_yazi_renk" />
                        </Grid>
                        <Divider />
                        <Button sx={{ mt: 2 }} onClick={submitForm} fullWidth size='md'>Kaydet</Button>
                    </Box>
                </TabPanel>
                <TabPanel value={2}>
                    <Typography level="inherit">
                        Gelecek
                    </Typography>
                </TabPanel>
            </Tabs>
        </Box>
    );
}

const ColorPick = React.memo(({ title, setterValue }) => {
    const inputRef = useRef(null);
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    const handleColorChange = useCallback(
        debounce((color) => {
            dispatch(updateSetting({ key: setterValue, value: color }));
        }, 300),
        [setterValue]
    );

    const resetColor = () => dispatch(updateSetting({ key: setterValue, value: defaultSettings[setterValue] }));
    //const resetColor = () => set(prevColors => ({ ...prevColors, [setterValue]: defaultSettings[setterValue] }));

    return (
        <Grid xs={12} sm={6} lg={4}>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        label="Pick a color"
                        onClick={() => inputRef.current.click()}
                        sx={{
                            background: settings[setterValue],
                            cursor: 'pointer',
                            '&:hover': {
                                background: lightenColor(settings[setterValue], 5)
                            }
                        }}
                    >
                        <input
                            type="color"
                            value={settings[setterValue]}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{ opacity: 0, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, cursor: 'pointer' }}
                            ref={inputRef}
                        />
                    </IconButton>
                    <Typography>{settings[setterValue]}</Typography>
                    <IconButton onClick={resetColor} disabled={settings[setterValue] === defaultSettings[setterValue]}>
                        <ReplayRounded />
                    </IconButton>
                </Box>
            </FormControl>
        </Grid>
    );
});


const SwitchPick = React.memo(({ title, setterValue }) => {
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    return (
        <Grid xs={12} sm={6} lg={4}>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Switch
                        checked={settings[setterValue] === "true"}
                        onChange={(event) => dispatch(updateSetting({ key: setterValue, value: event.target.checked === true ? "true" : "false" }))}
                        color={settings[setterValue] === "true" ? 'success' : 'neutral'}
                        variant={settings[setterValue] === "true" ? 'solid' : 'outlined'}
                        endDecorator={settings[setterValue] === "true" ? 'Açık' : 'Kapalı'}
                        slotProps={{
                            endDecorator: {
                                sx: {
                                    minWidth: 24,
                                },
                            },
                        }}
                    />
                </Box>
            </FormControl>
        </Grid>
    );
});

const InputPick = React.memo(({ title, setterValue, type }) => {
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    return (
        <Grid xs={12} sm={6} lg={4}>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Input
                        type={type}
                        value={type === "number" ? parseInt(settings[setterValue]) : settings[setterValue]}
                        onChange={(e) => dispatch(updateSetting({ key: setterValue, value: e.target.value }))}
                        slotProps={{
                            input: {
                                min: 1,
                                max: 3000,
                            },
                        }}
                        sx={{ width: 100, mt: 1 }}
                    />
                </Box>
            </FormControl>
        </Grid>
    );
});

export default SettingsPage;
