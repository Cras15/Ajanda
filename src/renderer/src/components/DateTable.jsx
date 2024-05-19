import { BusinessRounded, KeyboardArrowDown, KeyboardArrowUp, MaleRounded, PhoneRounded, QueryBuilderRounded, Search as SearchIcon, SubjectRounded } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
    Box, Button, Divider, Dropdown, FormControl, FormLabel, Input, Link, Menu, MenuButton, MenuItem, Option, Select, Sheet, Stack, Table, Textarea, Typography,
    useColorScheme
} from "@mui/joy";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import dayjs from "dayjs";
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDates } from "../redux/dateSlice";
import { fetchSettings } from "../redux/settingsSlice";
import { setSnackbar } from "../redux/snackbarSlice";
import ConfirmModal from "./ConfirmModal";
import CustomSnackbar from "./CustomSnackbar";
import TextMaskAdapter from "./TextMaskPhone";

const descendingComparator = (a, b, orderBy) => {
    if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number') {
        return a[orderBy] - b[orderBy];
    } else if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
        return a[orderBy].localeCompare(b[orderBy]);
    } else {
        return 0;
    }
};

const getComparator = (order, orderBy) => (
    order === "desc"
        ? (a, b) => descendingComparator(b, a, orderBy)
        : (a, b) => descendingComparator(a, b, orderBy)
);

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

const SortableTableHeader = React.memo(({ title, orderByValue, currentOrder, currentOrderBy, setOrder, setOrderBy }) => {
    const handleSort = useCallback(() => {
        const isAsc = orderByValue === currentOrderBy && currentOrder === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(orderByValue);
    }, [orderByValue, currentOrder, currentOrderBy, setOrder, setOrderBy]);

    const isActive = orderByValue === currentOrderBy;

    return (
        <Link
            underline="none"
            color={isActive ? "primary" : "inherit"}
            component="button"
            onClick={handleSort}
            fontWeight="lg"
            sx={{
                '&:hover': {
                    color: 'primary.500',
                },
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
            }}
            endDecorator={isActive && <ArrowDropDownIcon
                sx={{
                    transform: currentOrder === "desc" ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s"
                }}
            />}
        >
            {title}
        </Link>
    );
});

const RowMenu = React.memo(({ setShowConfirmModal, onRowClick }) => (
    <Dropdown>
        <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
        >
            <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
            <MenuItem sx={{ borderRadius: 'sm', mx: 1 }}>Görüntüle</MenuItem>
            <MenuItem sx={{ borderRadius: 'sm', mx: 1, mb: 0.5 }} onClick={onRowClick}>Düzenle</MenuItem>
            <Divider />
            <MenuItem sx={{ borderRadius: 'sm', mx: 1, mt: 0.5 }} color="danger" onClick={() => setShowConfirmModal(true)}>Sil</MenuItem>
        </Menu>
    </Dropdown>
));

const DateTable = ({ data }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");
    const [openRowId, setOpenRowId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const settings = useSelector(state => state.settings);
    const rowsPerPage = settings.tablo_satir_sayisi;
    const { mode, setMode } = useColorScheme();
    const dispatch = useDispatch();

    const handleSearch = useCallback((event) => {
        setSearchTerm(event.target.value.toLowerCase());
        setCurrentPage(1);
    }, []);

    const handleChangePage = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handleRowClick = useCallback((rowId) => {
        setOpenRowId(openRowId === rowId ? null : rowId);
    }, [openRowId]);

    const filteredDate = useMemo(() => (
        data.filter(date =>
            date.ad.toLowerCase().includes(searchTerm) ||
            date.soyad.toLowerCase().includes(searchTerm) ||
            date.telefon.toLowerCase().includes(searchTerm) ||
            date.kurum.toLowerCase().includes(searchTerm) ||
            date.cinsiyet.toLowerCase().includes(searchTerm) ||
            date.talep_tarihi.includes(searchTerm) ||
            date.randevu_tarihi.includes(searchTerm) ||
            date.randevu_konusu.toLowerCase().includes(searchTerm) ||
            date.aciklama.toLowerCase().includes(searchTerm)
        )
    ), [data, searchTerm]);

    const pageCount = useMemo(() => Math.ceil(filteredDate.length / rowsPerPage), [filteredDate.length]);

    const currentProducts = useMemo(() => (
        stableSort(filteredDate, getComparator(order, orderBy))
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    ), [filteredDate, order, orderBy, currentPage, rowsPerPage]);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(i);
        }
        return pages;
    }, [pageCount]);

    let backgroundColor = "";
    let darkModeBackgroundColor = "";

    if (settings.renksiz_baslik === "false" && settings?.renksiz_tablo === "false") {
        backgroundColor = settings.su_anki_randevu_renk;
        darkModeBackgroundColor = settings.su_anki_randevu_renk_dark;

        if (dayjs(currentProducts[0]?.randevu_tarihi).isBefore(dayjs())) {
            backgroundColor = settings.gecen_randevu_renk;
            darkModeBackgroundColor = settings.gecen_randevu_renk_dark;
        } else if (dayjs(currentProducts[0]?.randevu_tarihi).isBefore(dayjs().add(settings?.yaklasan_randevu_saat !== undefined ? settings.yaklasan_randevu_saat : '24', 'hour'))) {
            backgroundColor = settings.yaklasan_randevu_renk;
            darkModeBackgroundColor = settings.yaklasan_randevu_renk_dark;
        }

        if (mode === "dark")
            backgroundColor = darkModeBackgroundColor;
    }

    const renderFilters = () => (
        <>
            <FormControl size="sm">
                <FormLabel>Kategori</FormLabel>
                <Select
                    size="sm"
                    placeholder="Kategori Seç"
                    slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                >
                    <Option value="All">Tümü</Option>
                    <Option value="paid">Randevusu Geçenler</Option>
                    <Option value="pending">Randevusu Yaklaşanlar</Option>
                    <Option value="cancelled">İleri Tarihliler</Option>
                </Select>
            </FormControl>
        </>
    );

    useEffect(() => {
        const getSettings = async () => {
            dispatch(fetchSettings());
        };
        getSettings();
    }, []);

    useEffect(() => {
        console.log("değişti");
        // Eğer veri varsa ve mevcut sayfa 1'den büyükse ve veri uzunluğu rowsPerPage'in katıysa, sayfa numarasını azalt
        if (data && data.length > 0 && currentPage !== 1 && data.length % rowsPerPage === 0) {
            setCurrentPage(currentPage - 1);
        }
    }, [data, currentPage, rowsPerPage]);

    return (
        <>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    py: 2,
                    display: { xs: "none", sm: "flex" },
                    flexWrap: "wrap",
                    gap: 1.5,
                    "& > *": {
                        minWidth: { xs: "120px", md: "160px" }
                    }
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Randevu Ara</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Ara"
                        startDecorator={<SearchIcon />}
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="solid"
                sx={{
                    display: { xs: "none", sm: "initial" },
                    width: "100%",
                    borderRadius: "md",
                    maxHeight: '55vh',
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground": "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px"
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: "center", padding: "12px 6px", backgroundColor }} />
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}>
                                <SortableTableHeader
                                    title="Ad Soyad"
                                    orderByValue="ad"
                                    currentOrder={order}
                                    currentOrderBy={orderBy}
                                    setOrder={setOrder}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}>
                                <SortableTableHeader
                                    title="Telefon"
                                    orderByValue="telefon"
                                    currentOrder={order}
                                    currentOrderBy={orderBy}
                                    setOrder={setOrder}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}>
                                <SortableTableHeader
                                    title="Talep Tarihi"
                                    orderByValue="talep_tarihi"
                                    currentOrder={order}
                                    currentOrderBy={orderBy}
                                    setOrder={setOrder}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}>
                                <SortableTableHeader
                                    title="Randevu Tarihi"
                                    orderByValue="randevu_tarihi"
                                    currentOrder={order}
                                    currentOrderBy={orderBy}
                                    setOrder={setOrder}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}>
                                <SortableTableHeader
                                    title="Randevu Konusu"
                                    orderByValue="randevu_konusu"
                                    currentOrder={order}
                                    currentOrderBy={orderBy}
                                    setOrder={setOrder}
                                    setOrderBy={setOrderBy}
                                />
                            </th>
                            <th style={{ width: 140, padding: "12px 6px", backgroundColor }}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((row) => (
                            <Row key={row.id} row={row} isOpen={row.id === openRowId}
                                onRowClick={() => handleRowClick(row.id)} settings={settings} />
                        ))}
                    </tbody>
                </Table>
            </Sheet>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
                    display: { xs: "none", md: "flex" }
                }}
            >
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<KeyboardArrowLeftIcon />}
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Önceki Sayfa
                </Button>

                <Box sx={{ flex: 1 }} />
                {pageNumbers.map(page => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={page === currentPage ? "solid" : "outlined"}
                        color="neutral"
                        onClick={() => handleChangePage(page)}
                    >
                        {page}
                    </IconButton>
                ))}
                <Box sx={{ flex: 1 }} />

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    endDecorator={<KeyboardArrowRightIcon />}
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                >
                    Sonraki Sayfa
                </Button>
            </Box>
        </>
    );
};

const Row = React.memo(({ row, isOpen, onRowClick }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const dispatch = useDispatch();
    const { mode, setMode } = useColorScheme();
    const settings = useSelector(state => state.settings);

    const handleDeleteDate = useCallback(() => {
        setShowConfirmModal(false);
        window.db?.deleteDate(row.id);
        dispatch(setSnackbar({ children: "Randevu başarıyla silindi", color: 'success' }));
        dispatch(fetchDates());
    }, [row.id, dispatch]);

    const handleSubmitUpdate = useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const id = row.id;
        const name = formData.get('name');
        const surname = formData.get('surname');
        const gender = formData.get('gender');
        const date = formData.get('date');
        const time = formData.get('time');
        const phone = formData.get('phone');
        const requestDate = formData.get('requestDate');
        const subject = formData.get('subject');
        const business = formData.get('business');
        const institution = formData.get('institution');
        const randevuTarihi = `${date} ${time}`;

        window.db?.updateDate(id, name, surname, gender, business, phone, randevuTarihi, requestDate, subject, institution);

        onRowClick();
        dispatch(setSnackbar({ children: "Güncelleme başarılı", color: 'success' }));
        dispatch(fetchDates());
    }, [row.id, onRowClick, dispatch]);


    const isApproaching = dayjs(row.randevu_tarihi).isBefore(dayjs().add(settings?.yaklasan_randevu_saat !== undefined ? settings.yaklasan_randevu_saat : '24', 'hour'));
    const isPast = dayjs(row.randevu_tarihi).isBefore(dayjs());

    let backgroundColor = "";
    let textColor = "";

    if (settings?.renksiz_tablo === "false") {
        backgroundColor = settings.su_anki_randevu_renk;
        let darkModeBackgroundColor = settings.su_anki_randevu_renk_dark;
        let darkModeTextColor = settings.su_anki_randevu_yazi_renk_dark;
        textColor = settings.su_anki_randevu_yazi_renk;

        if (isPast) {
            backgroundColor = settings.gecen_randevu_renk;
            darkModeBackgroundColor = settings.gecen_randevu_renk_dark;
            textColor = settings.gecen_randevu_yazi_renk;
            darkModeTextColor = settings.gecen_randevu_yazi_renk_dark;
        } else if (isApproaching) {
            backgroundColor = settings.yaklasan_randevu_renk;
            darkModeBackgroundColor = settings.yaklasan_randevu_renk_dark;
            textColor = settings.yaklasan_randevu_yazi_renk;
            darkModeTextColor = settings.yaklasan_randevu_yazi_renk_dark;
        }

        if (mode === "dark") {
            backgroundColor = darkModeBackgroundColor;
            textColor = darkModeTextColor;
        }
    }

    return (
        <>
            <ConfirmModal open={showConfirmModal} handleClose={() => setShowConfirmModal(false)} handleDeleteItem={handleDeleteDate} />
            <CustomSnackbar snackbarb={{ color: 'success', children: 'Randevu başarıyla güncellendi', open: open }} />
            <tr key={row.id} style={{ backgroundColor }}>
                <td style={{ textAlign: "center", width: 120 }}>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={onRowClick}
                    >
                        {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </td>
                <td>
                    <Typography level="body-xs" textColor={textColor}>{row.ad} {row.soyad}</Typography>
                </td>
                <td>
                    <Typography level="body-xs" textColor={textColor}>{row.telefon}</Typography>
                </td>
                <td>
                    <Typography level="body-xs" textColor={textColor}>{row.talep_tarihi}</Typography>
                </td>
                <td>
                    <Typography level="body-xs" textColor={textColor}>{row.randevu_tarihi}</Typography>
                </td>
                <td>
                    <Typography level="body-xs" textColor={textColor}>{row.randevu_konusu}</Typography>
                </td>
                <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <RowMenu setShowConfirmModal={setShowConfirmModal} onRowClick={onRowClick} />
                        {settings.renksiz_tablo === "false" && isApproaching && !isPast && <QueryBuilderRounded sx={{ ml: 'auto', mr: 1 }} color="warning" />}
                    </Box>
                </td>
            </tr>
            {isOpen && (
                <tr>
                    <td style={{ height: 0, padding: 0 }} colSpan={7}>
                        <Sheet variant="" sx={{ p: 1, pl: 2, pr: 2, pt: 2 }}>
                            <Typography level="title-md" fontWeight='bold' component="div">
                                Randevu Düzenleme
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <form onSubmit={handleSubmitUpdate}>
                                <Stack spacing={2} sx={{ flexGrow: 1, display: 'flex' }}>
                                    <Stack direction="row" spacing={2}>
                                        <FormControl sx={{ flexGrow: 1 }} size="sm">
                                            <FormLabel>Ad Soyad</FormLabel>
                                            <Input size="sm" placeholder='Ad' name="name" defaultValue={row.ad} />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }} size="sm">
                                            <FormLabel> </FormLabel>
                                            <Input size="sm" placeholder="Soyad" name="surname" defaultValue={row.soyad} />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }} size="sm">
                                            <FormLabel>Cinsiyet</FormLabel>
                                            <Select placeholder="Cinsiyet Seçin" name="gender" startDecorator={<MaleRounded />} defaultValue={row.cinsiyet} sx={{ minWidth: 175 }} >
                                                <Option value="Erkek">Erkek</Option>
                                                <Option value="Kadın">Kadın</Option>
                                                <Option value="Bilinmiyor">Bilinmiyor</Option>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <FormControl sx={{ flexGrow: 1.2 }} size="sm">
                                            <FormLabel>Randevu Tarihi</FormLabel>
                                            <Input
                                                type="date"
                                                defaultValue={dayjs(row.randevu_tarihi.split(" ")[0]).format('YYYY-MM-DD')}
                                                name='date'
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1.35 }} size="sm">
                                            <FormLabel> </FormLabel>
                                            <Input
                                                type="time"
                                                name='time'
                                                defaultValue={row.randevu_tarihi.split(" ")[1]}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 0.8 }} size="sm">
                                            <FormLabel>Telefon</FormLabel>
                                            <Input
                                                size="sm"
                                                startDecorator={<PhoneRounded />}
                                                placeholder="Telefon"
                                                name='phone'
                                                defaultValue={row.telefon}
                                                slotProps={{ input: { component: TextMaskAdapter } }}
                                            />
                                        </FormControl>
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        <FormControl sx={{ flexGrow: 1.5 }} size="sm">
                                            <FormLabel>Talep Tarihi</FormLabel>
                                            <Input
                                                type="date"
                                                name='requestDate'
                                                defaultValue={dayjs(row.talep_tarihi).format("YYYY-MM-DD")}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }} size="sm">
                                            <FormLabel>Randevu Konusu</FormLabel>
                                            <Input
                                                size="sm"
                                                name="subject"
                                                startDecorator={<SubjectRounded />}
                                                placeholder="Randevu Konusu"
                                                defaultValue={row.randevu_konusu}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }} size="sm">
                                            <FormLabel>Kurumu</FormLabel>
                                            <Input
                                                size="sm"
                                                name="business"
                                                startDecorator={<BusinessRounded />}
                                                placeholder="Kurumu"
                                                defaultValue={row.kurum}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <FormControl sx={{ pb: 2 }} size="sm">
                                        <FormLabel>Açıklama</FormLabel>
                                        <Textarea name='institution' placeholder="Açıklama..." minRows={3} defaultValue={row.aciklama} />
                                    </FormControl>
                                    <Button type="submit">Güncelle</Button>
                                </Stack>
                            </form>
                        </Sheet>
                    </td>
                </tr>
            )}
        </>
    );
});

Row.propTypes = {
    initialOpen: PropTypes.bool,
    row: PropTypes.shape({
        ad: PropTypes.string.isRequired,
        soyad: PropTypes.string.isRequired,
        telefon: PropTypes.string.isRequired,
    }).isRequired,
};

export default DateTable;
