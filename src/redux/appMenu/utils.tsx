
/**
 * Flatten the nested list of menu items
 */
let uuid:number = 1;

interface menuItems{
    id:any,
    children:any,
    path:string,
    parentId:any,
    active:any,
    icon:any,
    roles:string[],
    route:void,
    header:string,
}

const assignIdAndParent = (menuItems:menuItems[], parentId?:any) => {
    menuItems = menuItems || [];
    menuItems.forEach(item => {
        const id = item.id || uuid;
        uuid += 1;
        item.id = id;
        item.parentId = item.parentId || parentId;
        item.active = false;

        if (typeof item.children !== 'undefined') {
            assignIdAndParent(item.children, id);
        }
    });
};
export default (menuItems:any) => {
    assignIdAndParent(menuItems);
    return menuItems;
};
