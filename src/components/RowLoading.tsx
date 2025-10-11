import React from 'react';
import Loader from './Loader';
interface rootProps{
    row?:number,
    column:number,
}
const RowLoading = (props:rootProps):any => {
    let {row, column} = props
    if(!row) {row = 25}
    let table:any = []
    // Outer loop to create parent
    for (let i = 0; i < row-1; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < column; j++) {
        children.push(<td key={j}><p className="animated-background" /></td>)
      }
      //Create the parent and add the children
      table.push(<tr key={i}>{children}</tr>)
    }
    let children = []
    //Inner loop to create children
    for (let j = 0; j < column-1; j++) {
      children.push(<td key={j}><p className="animated-background" /></td>)
    }
    children.push(<td key={column}><p className="animated-background" /><Loader/></td>)
    table.push(<tr key={row}>{children}</tr>)
    return(
        <tbody>
          {table}
        </tbody>
    )
}
export default RowLoading