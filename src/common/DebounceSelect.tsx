import { Empty, Select, SelectProps, Spin } from "antd";
import { debounce, isNil, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import TextUtils from "../helpers/TextUtils";

interface IDebounceSelectProps extends SelectProps {
  fetchOptions?: any;
  debounceTimeout?: any;
  optionDefault?: any[];
  optionMerge?: any[];
}

export const DebounceSelect = ({
  optionMerge,
  fetchOptions,
  loading,
  debounceTimeout = 800,
  ...props
}: IDebounceSelectProps) => {
  const { optionDefault, value, labelInValue, onBlur, onClear, onChange } =
    props;
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

  // 🔹 Handle blur - reset về optionDefault
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (debounceFetcher) {
      debounceFetcher("");
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  // 🔹 Handle clear - set value = null
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange(null as any, null as any);
    }
  };

  // 🔹 Handle onChange - xử lý cả trường hợp clear
  const handleChange = (val: any, option: any) => {
    if (val === undefined || val === null) {
      // Clear event
      handleClear();
    } else {
      // Normal change
      onChange?.(val, option);
    }
  };

  const optionRenders = useMemo(() => {
    // 🔹 Chuẩn hóa từng option (kể cả khi optionDefault là object có id/name)
    const normalizeOption = (e: any) => {
      if (typeof e === "string" || typeof e === "number") {
        return { value: e, label: e };
      }
      return {
        ...e,
        value: e?.id ?? e?.value ?? e?.code,
        label: e?.name ?? e?.label,
        optionData: e,
      };
    };

    // 🔹 Merge optionMerge vào options
    const mergedOptions = [...(optionMerge ?? []), ...(options ?? [])];

    // 🔹 Nếu labelInValue = false → value là string hoặc string[]
    // chỉ cần hiển thị options (không cần thêm value vào)
    if (!labelInValue) {
      return uniqBy(mergedOptions.map(normalizeOption), "value");
    }

    // 🔹 Ngược lại: labelInValue = true → cần kết hợp value + options
    const values = !isNil(value)
      ? props?.mode === "multiple"
        ? value
        : [value]
      : [];

    const combined = [...values, ...mergedOptions].map(normalizeOption);
    return uniqBy(combined, "value");
  }, [value, options, optionMerge, labelInValue, props?.mode]);

  // 🔹 Chuẩn hóa value để hiển thị (xử lý cả trường hợp labelInValue = false)
  const valueRender = useMemo(() => {
    if (!value) return value;

    // 🔹 Nếu labelInValue = false → giữ nguyên string hoặc string[]
    if (labelInValue === false) return value;

    // 🔹 Nếu labelInValue = true → chuẩn hóa object
    if (props?.mode === "multiple") {
      return value.map((v: any) => ({
        ...v,
        value: v?.id ?? v?.value,
        label: v?.name ?? v?.label,
        optionData: v,
      }));
    }

    return {
      ...value,
      value: value?.id ?? value?.value,
      label: value?.name ?? value?.label,
      optionData: value,
    };
  }, [value, labelInValue, props?.mode]);

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
      allowClear
      autoClearSearchValue
      style={{ fontSize: 16, width: "100%" }}
      // 🔹 Nếu có fetchOptions thì dùng debounce search, nếu không thì search tiếng Việt
      filterOption={fetchOptions ? false : filterOptionVi}
      onSearch={(val) => {
        // Reset options ngay khi bắt đầu search
        if (val) {
          setOptions([]);
        }
        if (fetchOptions && debounceFetcher) {
          debounceFetcher(val);
        }
      }}
      onBlur={handleBlur}
      onClear={handleClear}
      onChange={handleChange}
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

