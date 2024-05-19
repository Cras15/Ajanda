import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { convertData } from "../Utils";
import { defaultSettings } from "../hooks/defaultSettingsValue";

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
    const settingsString = await window.db?.readAllSettings();
    const settingsObj = convertData(settingsString);
    return settingsObj;
});

// Async thunk to update settings in the database
export const updateSettings = createAsyncThunk('settings/updateSettings', async (settings) => {
    await window.db?.updateSettingsWithJson(settings);
    return settings;
});

const initialState = defaultSettings;

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSetting: (state, action) => {
            const { key, value } = action.payload;
            if (state.hasOwnProperty(key)) {
                state[key] = value;
            }
        },
        resetSettings: state => {
            return defaultSettings;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => {
                return {
                    ...defaultSettings, // varsayılan değerleri uygula
                    ...state, // mevcut state'i koru
                    ...action.payload, // gelen veriyi uygula
                };
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                return {
                    ...defaultSettings, // varsayılan değerleri uygula
                    ...state, // mevcut state'i koru
                    ...action.payload, // gelen veriyi uygula
                };
            });
    },
});

export const { updateSetting, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;