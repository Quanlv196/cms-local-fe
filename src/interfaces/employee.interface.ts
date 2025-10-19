import { Battalion } from "../pages/configs/battalion/BattalionList";
import { Company } from "../pages/configs/company/CompanyList";
import { Platoon } from "../pages/configs/platoon/PlatoonList";

export interface Employee {
  id?: number;
  name?: string;
  code?: string;
  birthday?: string;
  home_town?: string;
  current_residence?: string;
  object?: string;
  role?: string;
  role_time?: string;
  position?: string;
  company?: Company;
  platoon?: Platoon;
  battalion?: Battalion;
  company_id?: number;
  platoon_id?: number;
  battalion_id?: number;
  position_time?: string;
  unit?: string;
  nation?: string;
  religion?: string;
  work_progress?: string;
  reward?: string;
  discipline?: string;
  mission_result?: string;
  family_infomation?: string;
  issues_of_concern?: string;
  is_care?: boolean;
  status?: number;
}
