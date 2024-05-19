import { useCallback, useEffect, useState } from 'react';

function useFetchData() {
    const [data, setData] = useState([]);

    const fetchData = useCallback(() => {
        const newdata = window.db?.readAllDate();
        setData(newdata);
        console.log(newdata);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);  // useCallback'ten dönen fonksiyon buraya dependency olarak eklendi.

    return data;
}

export default useFetchData;
