import React, { useContext } from 'react'
import { UserContext } from '../UserContext';

const CustomModel = ({ post }) => {

    const { userInfo } = useContext(UserContext)

    return (
        <div className='d-flex  align-items-center gap-3'>
            <img src={`http://localhost:4000/${userInfo.cover}`} className='rounded-circle  flex-shrink-1' height={40} width={40} />
            <div className='flex-grow-1'>
                <div className='d-flex'>
                    {
                        <p></p>
                    }
                </div>
            </div>
        </div>
    )
}

export default CustomModel