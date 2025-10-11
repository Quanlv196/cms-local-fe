import React, { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

// MyAsyncSelect loads options on render with loading message in the dropdown
export const MyAsyncSelect = props => {
  return (
    <AsyncSelect
      loadOptions={props.getAsyncData} // function that executes HTTP request and returns array of options
      placeholder={"Select...."}
      defaultOptions // load on render
      // defaultOptions={[id: 0, label: "Loading..."]} // uncomment this to load on input change
    />
  );
};

export const MySelectLoading = props => {
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleFocus = () => {
    if (!props.options && !hasLoaded) {
      setLoading(true);
      setHasLoaded(true);
      return props.getData().then(() => setLoading(false));
    }
  };

  return (
    <Select
      onFocus={handleFocus}
      options={props.options || [{ value: 0, label: "Loading..." }]}
      placeholder={loading ? "Loading options..." : "Select...."}
      isDisabled={loading}
    />
  );
};

// MyAsyncSelectLoading loads options on render with loading message in the text box
export const MyAsyncSelectLoading = props => {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('')
    // const [dataOption, setDataOption] = useState([])
  const getData = () => {
      setLoading(true)
    return props.getAsyncData(query).then(result => {
        // setLoading(false)
        return result
    });
  };
  const handleInputChange = (newValue) => {
    setQuery( newValue);
    return newValue;
  };


  return (
    <AsyncSelect
        onInputChange={handleInputChange}
        loadOptions={getData} // function that executes HTTP request and returns array of options
        inputValue={query}
        placeholder={loading ? "Loading..." : "Select...."}
      // isDisabled={loading} // uncomment this to disable dropdown until options loaded
    />
  );
};
