import React from 'react';
import { Button } from 'reactstrap';

const NavTab = (props?:any) => {
    interface tabList{
        value:any,
        title:string,
    }
    const {tabList:tabList={}, tab, setTab, btn, btnDisabled} = props
    if(btn){
        return (
            <div className={`nav-tabs-border ${props?.classes ? props?.classes :'mt-2 mb-3'}`}>
                <ul className="nav nav-tabs mt-0 mb-0">
                    {tabList.sort((a:any, b:any) => a.sort - b.sort).map((nav:any, index:number)=>(
                        <li className="nav-item" key={`tab-index${nav.total}-${index}`}>
                            <a style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)} className={`nav-link ${tab === nav.value &&'active'}`} >
                                <span className="">{nav.title} {nav.total>=0&&<span>({nav.total})</span>}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                {!btnDisabled&&btn?.map((item:any)=>(
                    <Button onClick={()=>item?.action()} color={item?.color} className={`mr-2 mb-1 pl-3 pr-3`}>{item?.title}</Button>
                ))}
            </div>
        )
    }
    return (
        <ul className={`nav nav-tabs  ${props?.classes ? props?.classes :'mt-2 mb-3'}`}>
            {tabList.sort((a:any, b:any) => a.sort - b.sort).map((nav:any, index:number)=>(
                <li className="nav-item" key={`tab-index${nav.total}-${index}`}>
                    <a style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)} className={`nav-link ${tab === nav.value &&'active'}`} >
                        <span className="">{nav.title} {nav.total>=0&&<span>({nav.total})</span>}</span>
                    </a>
                </li>
            ))}
            {!btnDisabled&&btn?.map((item:any, index:number)=>(
                <Button key={`btnDisabled-index-${index}`} onClick={()=>item?.action()} color={item?.color} className={`mr-2 mb-1 pl-3 pr-3`}>{item?.title}</Button>
            ))}
        </ul>
    )
}
export default NavTab