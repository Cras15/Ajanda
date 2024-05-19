import { AddCircleRounded, AssignmentRounded, BrightnessAutoRounded, ContactPageRounded, Delete, GetAppRounded, HomeRounded, KeyboardArrowDown, LogoutRounded, PersonRounded, PictureAsPdfRounded, QuestionAnswerRounded, ReceiptLongRounded, SearchRounded, SettingsRounded, UploadRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, DialogTitle, Divider, GlobalStyles, IconButton, Input, List, ListItem, ListItemButton, ListItemContent, Modal, ModalClose, ModalDialog, Sheet, Typography, listItemButtonClasses } from "@mui/joy";
import dayjs from "dayjs";
import ExcelJS from 'exceljs';
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeSidebar, excelDateToJSDate } from "../Utils";
import { fetchDates } from "../redux/dateSlice";
import { fetchSettings } from "../redux/settingsSlice";
import { setSnackbar } from "../redux/snackbarSlice";
import ColorSchemeToggle from "./ColorSchemeToggle";

function Toggler({ defaultExpanded = false, renderToggle, children }) {
    const [open, setOpen] = useState(defaultExpanded);
    return (
        <>
            {renderToggle({ open, setOpen })}
            <Box sx={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "0.2s ease", "& > *": { overflow: "hidden" } }}>
                {children}
            </Box>
        </>
    );
}

function Sidebar() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dates, status, error } = useSelector((state) => state.dates);
    const settings = useSelector(state => state.settings);
    const [excelData, setExcelData] = useState(undefined);
    const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);

    const configData = (data) => {
        if (!Array.isArray(data)) {
            throw new TypeError("Expected an array as input");
        }

        return data.map(item => ({
            Ad: item.ad,
            Soyad: item.soyad,
            Telefon: item.telefon,
            Cinsiyet: item.cinsiyet,
            Kurum: item.kurum,
            'Talep Tarihi': item.talep_tarihi,
            'Randevu Tarihi': item.randevu_tarihi,
            'Randevu Konusu': item.randevu_konusu,
            'Açıklama': item.aciklama,
        }));
    };

    const exportFile = async () => {
        await dispatch(fetchDates()).then(async (data) => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Randevular');
            const header = Object.keys(configData(data.payload)[0]);
            const columnWidths = { Ad: 15, Soyad: 15, Telefon: 15, Kurum: 15, 'Talep Tarihi': 15, 'Randevu Tarihi': 20, 'Randevu Konusu': 17, Açıklama: 30 };

            worksheet.columns = header.map(key => ({ header: key, key, width: columnWidths[key] }));
            worksheet.addRows(configData(data.payload));

            const setCellStyle = (cell, isHeader = false) => {
                const bgColor = isHeader ? `FF${settings.excel_baslik_arkaplan_renk.replace("#", "")}` : `FF${settings.excel_tablo_arkaplan_renk.replace("#", "")}`;
                const color = isHeader ? `FF${settings.excel_baslik_yazi_renk.replace("#", "")}` : `FF${settings.excel_tablo_yazi_renk.replace("#", "")}`;

                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                cell.font = {
                    bold: isHeader,
                    color: { argb: color } // Gövde için de siyah renk kullanıyoruz
                };
            };

            worksheet.getRow(1).eachCell(cell => setCellStyle(cell, true));
            worksheet.eachRow((row, rowNumber) => rowNumber > 1 && row.eachCell(cell => setCellStyle(cell)));

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Randevular.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(e.target.result);

            const worksheet = workbook.getWorksheet(1);
            const jsonData = [];
            const headerRow = worksheet.getRow(1);

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const rowData = {};
                    headerRow.eachCell((cell, colNumber) => rowData[cell.value] = row.getCell(colNumber).value);
                    jsonData.push(rowData);
                }
            });

            setExcelData(jsonData);
        };

        reader.onerror = console.error;
        reader.readAsArrayBuffer(file);
        fileInputRef.current.value = "";
    };

    const handleGetExcelClick = () => fileInputRef.current.click();

    const handleDeleteExcelData = (index) => setExcelData(excelData.filter((_, idx) => idx !== index));

    const handleAcceptExcelData = () => {
        excelData.forEach(item => {
            const date = dayjs(excelDateToJSDate(item['Randevu Tarihi'])).format('YYYY-MM-DD HH:mm');
            const date2 = dayjs(excelDateToJSDate(item['Talep Tarihi'])).format('YYYY-MM-DD');
            try {
                window.db?.insertDate(item['Ad'], item['Soyad'], item['Cinsiyet'], item['Telefon'], date, date2, item['Randevu Konusu'], item['Kurum'], item['Açıklama']);
            } catch (error) {
                console.error("Data upload error:", error);
                return;
            }
        });

        setExcelData(undefined);
        dispatch(setSnackbar({ children: "Veriler excelden alındı!", color: 'success' }));
        dispatch(fetchDates());
    };

    useEffect(() => {
        const fetchUpcomingAppointmentsCount = async () => {
            try {
                const count = await window.db?.countUpcomingDateWithinHours(settings.yaklasan_randevu_saat);
                setUpcomingAppointmentsCount(count);
            } catch (error) {
                console.error("Veriler gelirken hata oluştu:", error);
            }
        };
        dispatch(fetchSettings());
        fetchUpcomingAppointmentsCount();
    }, []);

    return (
        <>
            <Sheet
                className="Sidebar"
                sx={{
                    position: { xs: 'fixed', md: 'sticky' },
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: 'var(--Sidebar-width)',
                    p: 2,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    zIndex: 10000,
                    transition: 'transform 0.4s, width 0.4s',
                    transform: { xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))', md: 'none' },
                }}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".xls, .xlsx" />
                <GlobalStyles styles={(theme) => ({ ':root': { '--Sidebar-width': '220px', [theme.breakpoints.up('lg')]: { '--Sidebar-width': '240px' } } })} />
                <Box className="Sidebar-overlay" sx={{ position: 'fixed', zIndex: 9998, top: 0, left: 0, width: '100vw', height: '100vh', opacity: 'var(--SideNavigation-slideIn)', backgroundColor: 'var(--joy-palette-background-backdrop)', transition: 'opacity 0.4s', transform: { xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))', lg: 'translateX(-100%)' } }} onClick={closeSidebar} />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton variant="soft" color="primary" size="sm"><BrightnessAutoRounded /></IconButton>
                    <Typography level="title-lg">Yener Yazılım</Typography>
                    <ColorSchemeToggle sx={{ ml: 'auto' }} />
                </Box>
                <Input size="sm" startDecorator={<SearchRounded />} placeholder="Search" />
                <Box sx={{ minHeight: 0, overflow: 'hidden auto', flexGrow: 1, display: 'flex', flexDirection: 'column', [`& .${listItemButtonClasses.root}`]: { gap: 1.5 } }}>
                    <List size="sm" sx={{ gap: 1, '--List-nestedInsetStart': '30px', '--ListItem-radius': (theme) => theme.vars.radius.sm }}>
                        <ListItem><ListItemButton onClick={() => navigate('/')}><HomeRounded /><ListItemContent><Typography level="title-sm">Anasayfa</Typography></ListItemContent></ListItemButton></ListItem>
                        <ListItem nested>
                            <Toggler renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <AssignmentRounded /><ListItemContent><Typography level="title-sm">Randevular</Typography></ListItemContent>
                                    {settings.yaklasan_randevu_uyari === "true" && upcomingAppointmentsCount > 0 && <Chip size="sm" color="primary" variant="solid">{upcomingAppointmentsCount}</Chip>}
                                    <KeyboardArrowDown sx={{ transform: open ? 'rotate(180deg)' : 'none' }} />
                                </ListItemButton>
                            )}>
                                <List sx={{ gap: 0.5 }}>
                                    <ListItem sx={{ mt: 0.5 }}><ListItemButton onClick={() => navigate("/date/add")}><AddCircleRounded /><ListItemContent><Typography level="title-sm">Randevu Ekle</Typography></ListItemContent></ListItemButton></ListItem>
                                    <ListItem><ListItemButton onClick={() => navigate('/date/list')}><QuestionAnswerRounded /><ListItemContent><Typography level="title-sm">Randevu Listele</Typography></ListItemContent>{settings.yaklasan_randevu_uyari === "true" && upcomingAppointmentsCount > 0 && <Chip size="sm" color="primary" variant="solid">{upcomingAppointmentsCount}</Chip>}</ListItemButton></ListItem>
                                </List>
                            </Toggler>
                        </ListItem>
                        <ListItem nested>
                            <Toggler renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <PersonRounded /><ListItemContent><Typography level="title-sm">Rehber</Typography></ListItemContent><KeyboardArrowDown sx={{ transform: open ? 'rotate(180deg)' : 'none' }} />
                                </ListItemButton>
                            )}>
                                <List sx={{ gap: 0.5 }}>
                                    <ListItem sx={{ mt: 0.5 }}><ListItemButton onClick={() => navigate("/contact/add")}><AddCircleRounded /><ListItemContent><Typography level="title-sm">Kişi Ekle</Typography></ListItemContent></ListItemButton></ListItem>
                                    <ListItem><ListItemButton onClick={() => navigate("/contact/list")}><ContactPageRounded /><ListItemContent><Typography level="title-sm">Rehberim</Typography></ListItemContent></ListItemButton></ListItem>
                                </List>
                            </Toggler>
                        </ListItem>
                        <ListItem nested>
                            <Toggler renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <ReceiptLongRounded /><ListItemContent><Typography level="title-sm">Raporlama</Typography></ListItemContent><KeyboardArrowDown sx={{ transform: open ? 'rotate(180deg)' : 'none' }} />
                                </ListItemButton>
                            )}>
                                <List sx={{ gap: 0.5 }}>
                                    <ListItem sx={{ mt: 0.5 }}><ListItemButton onClick={exportFile}><UploadRounded /><ListItemContent><Typography level="title-sm">Excel'e Aktar</Typography></ListItemContent></ListItemButton></ListItem>
                                    <ListItem><ListItemButton onClick={handleGetExcelClick}>
                                        <GetAppRounded /><ListItemContent><Typography level="title-sm">Excelden Al</Typography></ListItemContent></ListItemButton></ListItem>
                                    <ListItem><ListItemButton onClick={() => navigate("/contact/list")}><PictureAsPdfRounded /><ListItemContent><Typography level="title-sm">PDF Aktar</Typography></ListItemContent></ListItemButton></ListItem>
                                </List>
                            </Toggler>
                        </ListItem>
                    </List>
                    <List size="sm" sx={{ mt: 'auto', flexGrow: 0, '--ListItem-radius': (theme) => theme.vars.radius.sm, '--List-gap': '8px' }}>
                        <ListItem><ListItemButton onClick={() => navigate("/settings")}><SettingsRounded />Ayarlar</ListItemButton></ListItem>
                    </List>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar variant="outlined" size="sm" />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography level="title-sm">Mert Y.</Typography>
                        <Typography level="body-xs">admin@admin</Typography>
                    </Box>
                    <IconButton size="sm" variant="plain" color="neutral"><LogoutRounded /></IconButton>
                </Box>
            </Sheet>
            <Modal open={!!excelData} onClose={() => setExcelData(undefined)}>
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>Exceldeki veriler</DialogTitle>
                    <List sx={{ overflow: 'scroll', mx: 'calc(-1 * var(--ModalDialog-padding))', px: 'var(--ModalDialog-padding)', minWidth: '350px' }}>
                        {excelData?.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem endAction={<IconButton aria-label="Delete" size="sm" color="danger" onClick={() => handleDeleteExcelData(index)}><Delete /></IconButton>}>
                                    <ListItemButton>{item.Ad} {item.Soyad}</ListItemButton>
                                </ListItem>
                                {index !== excelData?.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                    <Button color="success" onClick={handleAcceptExcelData}>Onayla</Button>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default Sidebar;
