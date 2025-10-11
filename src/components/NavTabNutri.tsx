import { isEqual } from 'lodash';
import React from 'react';
import { Button } from 'reactstrap';

const NavTabNutri = (props?:any) => {
    interface tabList{
        value:any,
        title:string,
    }
    const {tabList:tabList={}, tab, setTab} = props
    console.log('NavTabNutri', tab, tabList)
    return (
        <ul className={`nav nav-tabs nav-tabs-nutri`} >
            {tabList.sort((a:any, b:any) => a.sort - b.sort).map((nav:any, index:number)=>(
                <li className="nav-item" key={`tab-index${nav.total}-${index}`}>
                    <a style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)} 
                        className={`nav-link ${isEqual((tab || 0) , (nav.value || 0)) &&'active'}`} 
                    >
                        <span className="">{nav.title || nav.label} {nav.total>=0&&<span>({nav.total})</span>}</span>
                    </a>
                </li>
            ))}
        </ul>
    )
}
export default NavTabNutri