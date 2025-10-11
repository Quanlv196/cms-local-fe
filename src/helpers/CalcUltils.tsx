import { find } from "lodash";
import moment from "moment";

export default class CalcUtils {
  static getAgeLabel = (birthday?:any) => {
    if(!birthday) return null;
    const months = moment(birthday).format("MM")
    const years = moment(birthday).format("YYYY")
    const monthNow = moment().format("MM")
    const yearNow = moment().format("YYYY")
    let ageYear:number = 0;
    let ageMonth:number = 0;
    console.log("months", months, years);
    if(months > monthNow) {
        ageYear = Number(yearNow) - Number(years) - 1;
        ageMonth = 12 - Number(months) + Number(monthNow)
    }
    else {
        ageYear = Number(yearNow) - Number(years);
        ageMonth = Number(monthNow) - Number(months)
    }
    if(ageYear <= 5) {
        return `${ageYear} tuổi ${ageMonth} tháng (${Number(ageYear)*12 + Number(ageMonth)} tháng)`
    }
    else {
        return `${ageYear} tuổi ${ageMonth} tháng`
    }
}
    static getUserUpdate = (list:any, id:any) => {
        console.log("ahihi", list, id)
        const check = find(list,(e:any) => e?.id == id)
        if(check) {
            return check?.username
        }
        else return "---"
    }

  
}
