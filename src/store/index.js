import {
  configureStore,
  createSlice,
  createAsyncThunk,
  combineReducers,
} from "@reduxjs/toolkit";
import { client } from "../api/client";

export const fetchAudiences = createAsyncThunk("audiences", async () => {
  return await client.get("/audiences");
});

const initialState = {
  audiences: [],
  filteredRecords: [],
  displayedRecords: [],
  pagesTotal: 0,
  page: 0,
  pageSize: 5,
  status: "idle",
  error: null,
};

const audienceSlice = createSlice({
  name: "audience",
  initialState: initialState,
  reducers: {
    //TODO: most recent filter resets previous filters - filters don't accumulate, but reset each other, not yielding the intersection of subsets
    searchById(state, action) {
      let val = action.payload.value;
      state.displayedRecords = state.audiences.filter((aud) => {
        return aud.id === val;
      });
    },
    searchByName(state, action) {
      let val = action.payload.value.toLowerCase();
      //TODO: if val is cleared reset filter

      let filteredRecords = state.filteredRecords.filter((aud) => {
        // console.log(aud.name.toLowerCase().includes(val))
        return aud.name.toLowerCase().includes(val);
      });
      state.filteredRecords = filteredRecords;
      state.pagesTotal = Math.ceil(filteredRecords.length / state.pageSize);

      //always start showing results starting with 1st page
      state.page = 0;
      state.displayedRecords = filteredRecords.slice(0, state.pageSize);
    },
    loadData(state, action) {
      const page = action.payload.page;
      if (page === 0) {
        state.filteredRecords = [];
      }
      console.log("in load data for page: " + page);
      let stateCopy = Object.assign({}, state);
      const startIndex = page * state.pageSize;
      //to paginate filtered records, slice state.filtered
      state.displayedRecords = stateCopy.audiences.slice(
        startIndex,
        startIndex + state.pageSize
      );
      state.page = page;
    },
  },
  extraReducers: {
    [fetchAudiences.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchAudiences.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Populate state with fetched comments
      state.audiences = state.audiences.concat(action.payload);
      if (state.audiences.length) {
        state.filteredRecords = state.audiences.slice();
        state.recordsCount = state.audiences.length;
        state.pagesTotal = Math.ceil(state.audiences.length / state.pageSize);
        state.displayedRecords = state.audiences.slice(0, state.pageSize);
      }
    },
    [fetchAudiences.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});
export const selectAllAudiences = (state) => state.audience.audiences;
export const selectDisplayedRecords = (state) =>
  state.audience.displayedRecords;
export const selectFilteredRecords = (state) => state.audience.filteredRecords;
export const selectPage = (state) => state.audience.page;
export const selectPagesTotal = (state) => state.audience.pagesTotal;
export const selectAudienceStatus = (state) => state.audience.status;
export const {
  loadData,
  searchById,
  searchByName,
  sortById,
  sortByName,
  sortBySizeTotal,
} = audienceSlice.actions;

const store = configureStore({
  reducer: combineReducers({
    audience: audienceSlice.reducer,
  }),
  devTools: true,
});

export default store;
