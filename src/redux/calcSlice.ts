import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalcState {
  searchValue: string;
}

const initialState: CalcState = {
  searchValue: '',
};

const calcSlice = createSlice({
  name: 'calc',
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setSearchValue } = calcSlice.actions;

export default calcSlice.reducer;