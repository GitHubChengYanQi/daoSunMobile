import React from 'react';
import {config as baseConfig} from 'ice';
import {useAntdTable, useFusionTable} from 'ahooks';
import Service from '@/util/Service';

const UseTableRequest = (config, options = {}) => {

  const {ajaxService} = Service();
  const {component} = baseConfig;

  const requestService = (params, formData = {}) => {
    if (typeof params !== 'object') {
      params = {};
    }
    params.data = formData;
    return params;
  };

  const requestMethod = (params) => {
    const {...other} = params;
    const page = {};
    if (params) {
      page.limit = typeof params.pageSize !== 'undefined' ? params.pageSize : 10;
      page.page = typeof params.current !== 'undefined' ? params.current : 1;
    }
    return ajaxService({
      ...config,
      ...other,
      params: page
    });
  };

  const formatResult = (response) => {
    let list = [];
    if (Array.isArray(response.data)) {
      list = response.data;
    }
    return {list, total: response.count};
  };

  if (component !== 'Fusion') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAntdTable(requestService, {
      requestMethod,
      formatResult,
      ...options,
    });
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFusionTable(requestService, {
    requestMethod,
    formatResult,
    ...options,

  });
};

export default UseTableRequest;
