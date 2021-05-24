import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    searchById,
    searchByName,
    sortById,
    sortByName,
    sortBySizeTotal,
    loadData, selectPage, selectDisplayedRecords, selectPagesTotal, selectAllAudiences
} from "../store";
import Audience from "./Audience";
import './AudienceList.css'

const AudienceList = () => {
    const dispatch = useDispatch();

    const allAudiences = useSelector(selectAllAudiences)
    const displayedRecords = useSelector(selectDisplayedRecords)
    const page = useSelector(selectPage)
    const pagesTotal = useSelector(selectPagesTotal)

    const searchByIdHandler = (e) => {
        let input = e.target.value;
        if(!input) dispatch(loadData({page}))
        else dispatch(searchById({value: input}))
    }
    const searchByNameHandler = (e) => {
        let input = e.target.value;
        dispatch(searchByName({value: input}))
    }
    const sortByInput = (e) => {
        let value = e.target.value;
        let order = value.endsWith('asc') ? "asc" : "desc";

        if (value.startsWith('id')) {
            dispatch(sortById({order}))
        } else if(value.startsWith('name')) {
            dispatch(sortByName({order}))
        } else if(value.startsWith('size')) {
            dispatch(sortBySizeTotal({order}))
        }
    }
    const changePage = (page) => dispatch(loadData({page}))

    return (
        <>
            <h3>Audiences</h3>

            <select defaultValue={''} onChange={e => sortByInput(e)}>
                <option value='' disabled>Sort by</option>
                <option value={'id_asc'}>ID - Lowest to Highest</option>
                <option value={'id_asc'}>ID - Highest to Lowest</option>
                <option value={'name_asc'}> Name - A-Z</option>
                <option value={'name_desc'}>Name - Z-A</option>
                <option value={'size_asc'}> Size Total - Lowest to Highest</option>
                <option value={'size_desc'}>Size Total - Highest to Lowest</option>
            </select>
            <input placeholder='Search by ID' onChange={e=> searchByIdHandler(e)} type='number' min="0" max={allAudiences.length-1} />
            <input placeholder='Search by Name' onChange={e=> searchByNameHandler(e)} type='text'/>

            <button disabled={page==0} onClick={() => changePage(page-1)}>Previous Page</button>
            <button disabled={!(pagesTotal-1 > page)} onClick={() => changePage(page+1)}>Next Page</button>

            <div className={'audListCont'}>
                {displayedRecords &&
                displayedRecords.length > 0 &&
                displayedRecords.map((aud, index) => (
                    <Audience aud={aud} key={index}/>
                ))}
            </div>
        </>
    );
}

export default AudienceList;

