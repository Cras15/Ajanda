export function openSidebar() {
    if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
    }
}

export function closeSidebar() {
    if (typeof window !== 'undefined') {
        document.documentElement.style.removeProperty('--SideNavigation-slideIn');
        document.body.style.removeProperty('overflow');
    }
}

export function toggleSidebar() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const slideIn = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue('--SideNavigation-slideIn');
        if (slideIn) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

export function excelDateToJSDate2(excelDate) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel başlangıç tarihi
    const days = Math.floor(excelDate);
    const timeFraction = excelDate - days;
    const millisecondsOfDay = 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + days * millisecondsOfDay + timeFraction * millisecondsOfDay);

    // Zaman dilimi farkını düzeltecek şekilde ayarlayın
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date;
}

export function excelDateToJSDate(input) {
    if (/^\d+(\.\d+)?$/.test(input)) { // Eğer input sayısal bir değerse Excel tarih formatındadır
        return excelDateToJSDate2(parseFloat(input)).toISOString();
    } else { // Diğer durumda, doğrudan tarih string olarak ele alınabilir
        return new Date(input).toISOString();
    }
}

export const lightenColor = (color, percent) => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
};

export const convertData = (data) => {
    return data.reduce((acc, curr) => {
        acc[curr.ayar_adi] = curr.deger;
        return acc;
    }, {});
};

export function convertExcelColor(color) {
    console.log(color);
    let col = color.replace("#", "").toUpperCase();
    return 'FF' + col;
}
