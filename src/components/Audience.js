import React from "react";
import "./Audience.css"

const AudienceList = ({aud}) => {

    return (
        <div className={'audience'}>
            <p><span>ID: </span>{aud.id}</p>
            <p>{aud.name}</p>
            <p>{aud.totalSize}</p>
        </div>
    )
}
export default AudienceList
