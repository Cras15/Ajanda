import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';
import {
  countUpcomingDateWithinHours,
  deleteDate,
  deletePerson,
  insertDate,
  insertPerson,
  readAllDate,
  readAllPerson,
  readAllSettings,
  readSetting,
  readUpcomingDateWithinHours,
  updateDate,
  updateSettings,
  updateSettingsWithJson
} from '../main/manager';

const dbAPI = {
  readAllPerson,
  readAllDate,
  insertPerson,
  insertDate,
  updateDate,
  deletePerson,
  deleteDate,
  countUpcomingDateWithinHours,
  readUpcomingDateWithinHours,
  updateSettings,
  readAllSettings,
  readSetting,
  updateSettingsWithJson
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('db', dbAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.db = dbAPI;
}
