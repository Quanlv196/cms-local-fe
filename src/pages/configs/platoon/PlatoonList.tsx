import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, CardBody, Col, Row, Table } from "reactstrap";
import { Avatar, Input } from "antd";
import { useHistory } from "react-router";
import queryString from "query-string";
import { isEmpty, isNil } from "lodash";
import { baseUrl } from "../../../constants/environment";
import APIClient from "../../../helpers/APIClient";
import PageTitle from "../../../components/PageTitle";
import PageBody from "../../../components/PageBody";
import Pagination from "../../../components/Pagination";
import ModalPopup from "../../../components/ModalPopup";
import Loader from "../../../components/Loader";
import RowEmpty from "../../../components/RowEmpty";
import BattalionAdd from "./PlatoonAdd";
import {
  ActionModal,
  DataFilterProps,
  DataTableListProps,
  FilterParams,
  IBaseOptions,
  initialParams,
  ListProps,
  QueryParams,
  RenderActionModalProps,
} from "../../../interfaces/common.interface";
import { getLabelStatus } from "../../../components/LabelStatus";
import { Company } from "../company/CompanyList";

export interface Platoon extends IBaseOptions {
  id?: number;
  name?: string;
  company_id?: Company;
  status?: number;
}

const configPage = {
  titlePage: "Danh sách trung đội",
  pathPage: "/platoon/list",
  column: 4,
};

const List: React.FC<ListProps> = (props) => {
  const [{ page, limit, filter }, setParams] =
    useState<QueryParams>(initialParams);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Platoon[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<ActionModal>({ type: "add" });
  const [status, setStatus] = useState<number | null>(null);
  const searchPrams = queryString.parse(props.location.search);

  const setPage = (value: number) => {
    setParams((prev) => ({ ...prev, page: value }));
  };

  const setLimit = (value: number) => {
    setParams((prev) => ({ ...prev, limit: value }));
  };

  const setFilter = (value: FilterParams) => {
    setParams((prev) => ({ ...prev, filter: value, page: 1 }));
  };

  useEffect(() => {
    document.title = configPage.titlePage;
    getFilterParams();
  }, []);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!isEmpty(searchPrams) && !loading) {
      loadData();
    }
  }, [limit, page, filter]);

  useEffect(() => {
    if (isEmpty(searchPrams)) {
      setParams(initialParams);
      loadData();
    }
  }, [searchPrams]);

  const handleActionModal = (item: ActionModal) => {
    setAction(item);
    setIsOpen(true);
  };

  const getFilterParams = () => {
    const newFilter: FilterParams = {};
    if (!isEmpty(searchPrams)) {
      Object.keys(searchPrams).forEach((key) => {
        switch (key) {
          case "page":
            setPage(Number(searchPrams[key]));
            break;
          case "limit":
            setLimit(Number(searchPrams[key]));
            break;
          default:
            newFilter[key] = searchPrams[key];
            break;
        }
      });
      setFilter(newFilter);
    }
  };

  const setFilterParams = (params: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    props.history.push({ search: `?${query}` });
  };

  const loadData = async () => {
    const params = { page, limit, ...filter };
    if (!params.name) delete params.name;
    const URL = `${baseUrl}/platoon`;
    setFilterParams(params);
    setLoading(true);
    const response: any = await APIClient.GET(URL, params);
    setLoading(false);
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setData(response.response.data);
      setTotalElements(response.response.total);
    }
  };

  return (
    <>
      <PageTitle
        title="Quản lý trung đội"
        breadCrumbItems={[
          { label: "Cấu hình", active: true },
          { label: "Quản lý trung đội", active: true },
        ]}
        rightContent={
          <div className="group__button">
            <Button
              color="primary"
              onClick={() => handleActionModal({ type: "add" })}
              className="bilet_button"
            >
              <i className="uil-plus"></i> Thêm trung đội
            </Button>
          </div>
        }
      />

      <PageBody>
        <DataFilter filter={filter} setFilter={setFilter} loadData={loadData} />
        <DataTableList
          data={data}
          loading={loading}
          handleActionModal={handleActionModal}
          page={page}
          limit={limit}
        />
        <Pagination
          link={configPage.pathPage}
          setPage={setPage}
          page={page}
          limit={limit}
          setLimit={setLimit}
          totalElements={totalElements}
        />
      </PageBody>

      <ModalPopup
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
          loadData();
        }}
      >
        <RenderActionModal
          status={status}
          loadData={loadData}
          closeModal={() => setIsOpen(false)}
          action={action}
        />
      </ModalPopup>

      {loading && <Loader />}
    </>
  );
};

const DataFilter: React.FC<DataFilterProps> = ({
  setFilter,
  filter,
  loadData,
}) => {
  const [code, setCode] = useState(filter?.query);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(filter.name);
  }, [filter.name]);

  useEffect(() => {
    if (isNil(code)) return;
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      setFilter({ ...filter, name: code });
    }, 500);
  }, [code]);

  const _onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilter({ ...filter, name: (e.target as HTMLInputElement).value });
    }
  };

  return (
    <div className="filter-custom pb-3 mb-3">
      <Row className="form_normal">
        <Col md={9}>
          <Row>
            <Col md={7}>
              <Input
                prefix={
                  <i style={{ color: "#7E8B99" }} className="uil-search"></i>
                }
                allowClear
                onKeyPress={_onKeyPress}
                onChange={(e) => setCode(e.target.value)}
                value={code}
                placeholder="Tìm kiếm trung đội"
              />
            </Col>
            <Col md={2}>
              <Button
                color="primary"
                className="bilet_button height-44"
                outline
                onClick={loadData}
              >
                <i className="uil-search"></i> Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const DataTableList: React.FC<DataTableListProps> = ({
  data,
  limit,
  page,
  handleActionModal,
}) => {
  const start = limit * (page - 1);
  const router = useHistory();

  const gotoDetail = (item: Platoon) => {
    router.push(`/platoon/${item.id}/view`);
  };

  const RenderHeadData = () => (
    <thead>
      <tr>
        <th style={{ minWidth: 50 }}>Stt</th>
        <th style={{ minWidth: 120 }}>Tên trung đội</th>
        <th style={{ minWidth: 120 }}>Đại đội</th>
        <th style={{ minWidth: 120 }}>Tiểu đoàn</th>
        <th style={{ minWidth: 100 }}>Trạng thái</th>
        <th style={{ width: 60 }}></th>
      </tr>
    </thead>
  );

  const RenderBodyData = () => {
    if (data.length === 0)
      return (
        <RowEmpty
          column={configPage.column}
          title="Không tồn tại bản ghi nào"
        />
      );

    return (
      <tbody>
        {data.map((item, index) => (
          <tr key={item.id}>
            <td>{start + index + 1}</td>
            <td onClick={() => gotoDetail(item)}>{item.name || "---"}</td>
            <td onClick={() => gotoDetail(item)}>
              {item.company_id?.name || "---"}
            </td>
            <td onClick={() => gotoDetail(item)}>
              {item.company_id?.battalion_id?.name || "---"}
            </td>
            <td onClick={() => gotoDetail(item)}>
              {getLabelStatus(item?.status)}
            </td>
            <td>
              <div className="list__action_table">
                <div
                  onClick={() =>
                    handleActionModal?.({ type: "delete", data: item })
                  }
                  className="item bg_danger"
                >
                  <i className="uil-trash-alt"></i>
                </div>
                <div
                  onClick={() =>
                    handleActionModal?.({ type: "edit", data: item })
                  }
                  className="item bg_primary"
                >
                  <i className="uil-pen"></i>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="libet-table">
      <Table responsive bordered className="table">
        <RenderHeadData />
        <RenderBodyData />
      </Table>
    </div>
  );
};

const RenderActionModal: React.FC<RenderActionModalProps> = ({
  closeModal,
  loadData,
  action,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const URL = `${baseUrl}/platoon/${action?.data?.id}`;
    setLoading(true);
    const response: any = await APIClient.DELETE(URL);
    setLoading(false);
    if (response.error) {
      toast.error(response.error.error_description);
    } else {
      closeModal();
      loadData();
      toast.success("Xóa trung đội thành công!");
    }
  };

  if (action.type === "delete") {
    return (
      <CardBody className="p-0" style={{ width: 400 }}>
        <div className="modal-header" style={{ border: "none" }}>
          <button onClick={closeModal} type="button" className="close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <Avatar
            className="d-flex justify-content-center align-items-center"
            style={{ width: 60, height: 60, backgroundColor: "#FEF0C7" }}
            icon={
              <i
                style={{ color: "#C12818", fontSize: 26 }}
                className="uil-trash-alt"
              ></i>
            }
          />
        </div>
        <div className="p-3">
          <h5
            className="text-center"
            style={{ color: "#C12818", fontSize: 24 }}
          >
            Xóa trung đội
          </h5>
          <p className="text-center" style={{ fontSize: 16 }}>
            Bạn có muốn xóa trung đội{" "}
            <b style={{ color: "#272E35" }}>{`"${action.data?.name}"`}</b>?
          </p>
        </div>

        <div className="modal-footer">
          <Button
            onClick={handleDelete}
            className="ml-2 bilet_button"
            color="success"
          >
            Có
          </Button>
          <Button
            onClick={closeModal}
            className="ml-2 bilet_button outline"
            color="success"
          >
            Không
          </Button>
        </div>
        {loading && <Loader />}
      </CardBody>
    );
  }

  return (
    <CardBody className="p-0" style={{ width: 600 }}>
      <div className="modal-header">
        <h5 className="modal-title">
          {action.type === "add" ? "Thêm" : "Chỉnh sửa"} trung đội
        </h5>
        <button onClick={closeModal} type="button" className="close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <BattalionAdd
        closeModal={closeModal}
        dataProps={action}
        loadData={loadData}
      />
      {loading && <Loader />}
    </CardBody>
  );
};

export default List;
