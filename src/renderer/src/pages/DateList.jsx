import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DateTable from '../components/DateTable';
import { fetchDates } from '../redux/dateSlice';

const DateList = () => {
    const dispatch = useDispatch();
    const { dates, status, error } = useSelector((state) => state.dates);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDates());
        }
    }, [status]);
    return (
        <div>
            {dates != "" && <DateTable data={dates} />}
        </div>
    )
}

export default DateList