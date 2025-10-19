export interface FilterParams {
  name?: string;
  [key: string]: any;
}

export interface QueryParams {
  page: number;
  limit: number;
  filter: FilterParams;
}

export interface ActionModal {
  type: "add" | "edit" | "delete";
  data?: any;
}

export interface DataTableListProps {
  data: any[];
  page: number;
  limit: number;
  loading?: boolean;
  handleActionModal?: (action: ActionModal) => void;
}
export interface RenderActionModalProps {
  closeModal: () => void;
  loadData: () => void;
  action: ActionModal;
  item?: any;
  status?: number | null;
  setDataChecked?: (data: any) => void;
}
export const initialParams: QueryParams = {
  page: 1,
  limit: 25,
  filter: {},
};

export interface ListProps {
  location: {
    search: string;
  };
  history: {
    push: (params: any) => void;
  };
}

export interface DataFilterProps {
  filter: FilterParams;
  setFilter: (filter: FilterParams) => void;
  loadData: () => void;
}

export interface IBaseOptions {
  value?: string | number;
  label?: string;
}

export interface ISelectOption {
  label: string;
  value: number | string;
  name: string;
  id: number | string;
}
export interface ScopeFilter {
  battalion_id?: number;
  company_id?: number;
  platoon_id?: number;
  created_uid?: number;
}
