import {configureStore, createSlice, createAsyncThunk, combineReducers} from "@reduxjs/toolkit";
import { client } from "../api/client"

export const fetchAudiences = createAsyncThunk("audiences", async () => {
    return await client.get("http://localhost:3000/audiences");
});

const SORT_BY_ID = "SORT_BY_ID";
const SORT_BY_NAME = "SORT_BY_NAME";
const SORT_BY_SIZE_TOTAL = "SORT_BY_SIZE_TOTAL";

const SEARCH_BY_ID = "SEARCH_BY_ID";
const SEARCH_BY_NAME = "SEARCH_BY_NAME";

export const sortById = payload => ({
    type: SORT_BY_ID,
    payload
});
export const sortByName = payload => ({
    type: SORT_BY_NAME,
    payload
});
export const sortBySizeTotal = payload => ({
    type: SORT_BY_SIZE_TOTAL,
    payload
});

export const searchById = payload => ({
    type: SEARCH_BY_ID,
    payload
});
export const searchByName = payload => ({
    type: SEARCH_BY_NAME,
    payload
});

const initialState = {
    audiences: [],
    status: "idle",
    error: null,
}

const audienceSlice = createSlice({
    name: 'audience',
    initialState: initialState,
    extraReducers: {
        [fetchAudiences.pending]: (state, action) => {
            state.status = "loading";
        },
        [fetchAudiences.fulfilled]: (state, action) => {
            state.status = "succeeded";
            // Populate state with fetched comments
            state.audiences = state.audiences.concat(action.payload);
        },
        [fetchAudiences.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        },
        "SEARCH_BY_ID": (state, action) => {
            let val = action.payload.value;

            let filtered = state.audiences.filter(aud => {
                return aud.id === val;
            });
            return {
                ...state,
                audiences: filtered,
            };
        },
        "SEARCH_BY_NAME": (state, action) => {
            let val = action.payload.value.toLowerCase();

            let filtered = state.audiences.filter(aud => {
                // console.log(aud.name.toLowerCase().includes(val))
                return aud.name.toLowerCase().includes(val);
            });
            return {
                ...state,
                audiences: filtered,
            };
        },
        "SORT_BY_SIZE_TOTAL": (state, action) => {

        }
    },
})
export const selectAllAudiences = (state) => state.audience.audiences;
export const selectAudienceStatus = (state) => state.audience.status;

const store = configureStore({
    reducer: combineReducers({
        audience: audienceSlice.reducer
    }),
    devTools: true,
});

// if (module.hot) {
//     module.hot.accept("./audienceSlice.reducer", () => {
//         const reducers = require("store/slices").default;
//
//         store.replaceReducers(reducers);
//     });
// }

export default store;

function sortAsc(arr, field) {
    return arr.sort(function(a, b) {
        if (a[field] > b[field]) return 1;

        if (b[field] > a[field]) return -1;

        return 0;
    });
}

function sortDesc(arr, field) {
    return arr.sort(function(a, b) {
        if (a[field] > b[field]) return -1;

        if (b[field] > a[field]) return 1;

        return 0;
    });
}
function addFilterIfNotExists(filter, appliedFilters) {
    let index = appliedFilters.indexOf(filter);
    if (index === -1) appliedFilters.push(filter);

    return appliedFilters;
}
function removeFilter(filter, appliedFilters) {
    let index = appliedFilters.indexOf(filter);
    appliedFilters.splice(index, 1);
    return appliedFilters;
}