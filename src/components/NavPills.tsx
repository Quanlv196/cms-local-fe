import React from 'react';
import { Button } from 'reactstrap';

const NavPills = (props?:any) => {
    interface tabList{
        value:any,
        title:string,
    }
    const {tabList:tabList={}, tab, setTab, btn, btnDisabled} = props
    return (
        <>        
        {/* <ul className="nav nav-tabs mt-2 mb-3">
            {tabList.sort((a:any, b:any) => a.sort - b.sort).map((nav:any, index:number)=>(
                <li className="nav-item" key={`tab-index${nav.title}`}>
                    <a style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)} className={`nav-link ${tab === nav.value &&'active'}`} >
                        <span className="">{nav.title} {nav.total>=0&&<span>({nav.total})</span>}</span>
                    </a>
                </li>
            ))}
            {!btnDisabled&&btn?.map((item:any)=>(
                <Button onClick={()=>item?.action()} color={item?.color} className={`mr-2 mb-1`}>{item?.title}</Button>
            ))}
        </ul> */}
        <ul className="nav nav-pills navtab-bg nav-justified p-1">
            {tabList.sort((a:any, b:any) => a.sort - b.sort).map((nav:any, index:number)=>(
                // <li className="nav-item" key={`tab-index${nav.title}`}>
                //     <a style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)} className={`nav-link ${tab === nav.value &&'active'}`} >
                //         <span className="">{nav.title} {nav.total>=0&&<span>({nav.total})</span>}</span>
                //     </a>
                // </li>
                <li className="nav-item" key={`tab-index${nav.title}`}>
                    <a
                    style={{cursor:'pointer'}} onClick={()=>setTab(nav.value)}
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className={`nav-link ${tab === nav.value &&'active'}`}
                    >
                    <span className="d-block d-sm-none">
                        <i className="uil-home-alt" />
                    </span>
                    <span className="d-none d-sm-block">{nav.title} {nav.total>=0&&<span>({nav.total})</span>}</span>
                    </a>
                </li>
            ))}
        </ul>
        </>

    )
}
export default NavPills