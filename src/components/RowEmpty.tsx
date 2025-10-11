import React from 'react';
import noData from '../assets/images/ic_row-empty.svg';
import noImage from '../assets/images/users/no-img.jpg';
interface rootProps{
    column?:number,
    title?:string,
}
const RowEmpty = (props:rootProps):any => {
    const {title,column} = props
    return(
        <tbody>
            <tr>
                <td colSpan={column} className='no-data text-center' style={{cursor:'unset'}}>
                    <p style={{textAlign:'center',marginTop:10}}>{title?title:'Không tồn tại bản ghi nào'}</p>
                </td>
            </tr>
        </tbody>
    )
}
export default RowEmpty