import { Empty, Select, SelectProps, Spin } from "antd";
import { debounce, isNil, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import TextUtils from "../helpers/TextUtils";

interface IDebounceSelectProps extends SelectProps {
  fetchOptions?: any;
  debounceTimeout?: any;
  optionDefault?: any;
}

export const DebounceSelect = ({
  fetchOptions,
  loading,
  debounceTimeout = 800,
  ...props
}: IDebounceSelectProps) => {
  const { optionDefault, value, labelInValue } = props;
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState(optionDefault || []);
  const fetchRef = React.useRef(0);

  useEffect(() => {
    setOptions(optionDefault || []);
  }, [optionDefault]);

  // 🔹 Nếu có fetchOptions thì dùng debounce để search API
  const debounceFetcher = useMemo(() => {
    if (!fetchOptions) return undefined;

    const loadOptions = (val: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setFetching(true);

      fetchOptions(val).then((newOptions: any) => {
        if (fetchId !== fetchRef.current) return;
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  console.log("fetchOptionsxx", fetchOptions, optionDefault);

  // 🔹 Kết hợp giá trị hiện tại + danh sách options
  const optionRenders = useMemo(() => {
    const values = !isNil(value)
      ? props?.mode === "multiple"
        ? value
        : [value]
      : [];

    const combined = [...values, ...(options ?? [])].map((e: any) => ({
      ...e,
      value: e?.id ?? e?.value,
      label: e?.name ?? e?.label,
      optionData: e,
    }));

    return uniqBy(combined, "value");
  }, [value, options]);

  // 🔹 Chuẩn hóa value để hiển thị
  const valueRender = useMemo(() => {
    if (!value) return value;
    if (props?.mode === "multiple") return value;
    return [
      {
        ...value,
        value: value?.id || value?.value,
        label: value?.name || value?.label,
        optionData: value,
      },
    ];
  }, [value]);

  // 🔹 Hàm lọc mặc định có xử lý tiếng Việt (nếu không có fetchOptions)
  const filterOptionVi = (input: string, option: any) => {
    if (!option?.label) return false;
    const inputNoAccent = TextUtils.removeVietNamese(input).toLowerCase();
    const labelNoAccent = TextUtils.removeVietNamese(
      option.label
    ).toLowerCase();
    return labelNoAccent.includes(inputNoAccent);
  };

  return (
    <Select
      {...props}
      optionLabelProp="label"
      labelInValue={!isNil(labelInValue) ? labelInValue : true}
      showSearch
      style={{ fontSize: 16, width: "100%" }}
      // 🔹 Nếu có fetchOptions thì dùng debounce search, nếu không thì search tiếng Việt
      filterOption={fetchOptions ? false : filterOptionVi}
      onSearch={(val) => {
        if (fetchOptions && debounceFetcher) {
          console.log("Searching:", val);
          debounceFetcher(val);
        }
      }}
      notFoundContent={
        fetchOptions && fetching ? (
          <Spin size="small" />
        ) : (
          <Empty description="Không có dữ liệu" />
        )
      }
      options={optionRenders}
      value={valueRender}
    />
  );
};
