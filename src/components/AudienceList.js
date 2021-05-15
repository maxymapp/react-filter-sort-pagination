import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchAudiences, selectAllAudiences, searchById, searchByName, sortById, sortByName, sortBySizeTotal, loadData
} from "../store";
import Audience from "./Audience";


const AudienceList = () => {
    const dispatch = useDispatch();

    const audiences = useSelector(selectAllAudiences);
    const audienceStatus = useSelector((state) => state.audience.status);

    const searchByIdHandler = (e) => {
        let input = e.target.value;
        dispatch(searchById({value: input}))
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
            <input placeholder='Search by ID' onChange={e=> searchByIdHandler(e)} type='text'/>
            <input placeholder='Search by Name' onChange={e=> searchByNameHandler(e)} type='text'/>

            <div className={'audListCont'}>
                {audiences &&
                audiences.length > 0 &&
                audiences.map((aud, index) => (
                    <Audience aud={aud} key={index}/>
                ))}
            </div>
        </>
    );
};

export default AudienceList;

