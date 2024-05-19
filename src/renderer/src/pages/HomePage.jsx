import { DateRangeRounded, PersonRounded, QueryBuilderRounded } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography } from '@mui/joy';
import React from 'react';
import StatsCard from '../components/StatsCard';

const testAppointments = [
    { date: '2024-05-14T10:00:00', title: 'Doktor Randevusu' },
    { date: '2024-05-14T14:00:00', title: 'İş Toplantısı' },
];

const testDailyAppointments = [
    { date: '2024-05-14T09:00:00', title: 'Sabah Koşusu' },
    { date: '2024-05-14T11:00:00', title: 'Online Ders' },
];

const testNotifications = [
    { message: 'Yarın önemli bir toplantınız var.' },
    { message: 'Yeni mesajlarınızı kontrol edin.' },
];

const testNotes = [
    { content: 'Alışveriş listesi: Süt, Ekmek, Yumurta' },
    { content: 'Proje teslim tarihi: 20 Mayıs 2024' },
];

const testRecentAppointments = [
    { date: '2024-05-13T16:00:00', title: 'Müşteri Görüşmesi' },
    { date: '2024-05-12T11:00:00', title: 'Araştırma Toplantısı' },
];

const testPendingTasks = [
    { title: 'Raporu tamamla', dueDate: '2024-05-15' },
    { title: 'Yeni müşteri ile görüş', dueDate: '2024-05-16' },
];

const HomePage = () => {
    return (
        <Box sx={{ pt: 5, px: 5 }}>
            <Grid container spacing={4} sx={{ flexGrow: 1 }}>
                <Grid xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Randevular"
                        value={testAppointments.length}
                        link="/date/list"
                        icon={<DateRangeRounded sx={{ fontSize: 48, m: 'auto' }} color='primary' />}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Kişiler"
                        value="3"
                        link="/contact/list"
                        icon={<PersonRounded sx={{ fontSize: 48, m: 'auto' }} color='primary' />}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Yaklaşan Randevular"
                        value="2"
                        link="/date/list"
                        icon={<QueryBuilderRounded sx={{ fontSize: 48, m: 'auto' }} color='primary' />}
                    />
                </Grid>
                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                Günlük Randevular
                            </Typography>
                            {testDailyAppointments.length > 0 ? (
                                testDailyAppointments.map((appointment, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {new Date(appointment.date).toLocaleTimeString()} - {appointment.title}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Bugün için randevu bulunmamaktadır.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                Bildirimler
                            </Typography>
                            {testNotifications.length > 0 ? (
                                testNotifications.map((notification, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {notification.message}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Yeni bildirim bulunmamaktadır.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                Kişisel Notlar
                            </Typography>
                            {testNotes.length > 0 ? (
                                testNotes.map((note, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {note.content}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Kişisel not bulunmamaktadır.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                Son Yapılan Randevular
                            </Typography>
                            {testRecentAppointments.length > 0 ? (
                                testRecentAppointments.map((appointment, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {new Date(appointment.date).toLocaleString()} - {appointment.title}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Son yapılan randevu bulunmamaktadır.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                Tamamlanmamış Görevler
                            </Typography>
                            {testPendingTasks.length > 0 ? (
                                testPendingTasks.map((task, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {task.dueDate} - {task.title}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Tamamlanmamış görev bulunmamaktadır.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomePage;
