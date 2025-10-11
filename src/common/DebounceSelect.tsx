import { Empty, Select, Spin } from "antd";
import { debounce, isNil, uniqBy } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";

export const DebounceSelect = ({
  fetchOptions,
  loading,
  dataConcat,
  debounceTimeout = 800,
  ...props
}: any) => {
  const { optionDefault, onlyView, value, hideClear, labelInValue } = props;
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState(optionDefault);
  const fetchRef = React.useRef(0);
  useEffect(() => {
    setOptions(optionDefault);
  }, [optionDefault]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions: any) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, value]);

  const optionRenders = useMemo(() => {
    const combined = [...(dataConcat || []), ...(options || [])]?.map(
      (e: any) => {
        return {
          ...e,
          value: e?.id || e?.value,
          label: e?.name || e?.label,
          optionData: e,
        };
      }
    );

    return uniqBy(combined, "value");
  }, [dataConcat, options]);

  return (
    <Select
      {...props}
      disabled={onlyView}
      optionLabelProp="label"
      labelInValue={!isNil(labelInValue) ? labelInValue : true}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? (
          <Spin size="small" />
        ) : (
          <Empty description="Không có dữ liệu" />
        )
      }
      showSearch
      allowClear={!hideClear}
      style={{ fontSize: 16, width: "100%" }}
      dropdownStyle={{ minWidth: 500 }}
      options={optionRenders}
    />
  );
};
