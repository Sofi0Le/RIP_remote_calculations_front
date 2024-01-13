import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApplicationState {
  statusValue: string;
  startValue: string;
  endValue: string;
  searchValue: string;
}

const initialState: ApplicationState = {
  statusValue: '',
  startValue: '',
  endValue: '',
  searchValue: '',
};

const applicSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStatusValue: (state, action: PayloadAction<string>) => {
      state.statusValue = action.payload;
    },
    setStartValue: (state, action: PayloadAction<string>) => {
      state.startValue = action.payload;
    },
    setEndValue: (state, action: PayloadAction<string>) => {
      state.endValue = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
  },
});

export const {
  setStatusValue,
  setStartValue,
  setEndValue,
  setSearchValue,
} = applicSlice.actions;

export default applicSlice.reducer;
