import { useRequest as ahooksRequest } from 'ahooks';
import Service, { errorAction } from '../Service';

const useRequest = (config, options = {}) => {
  const { ajaxService } = Service();

  const requestService = (params) => {
    return params || {};
  };

  const formatResult = (response) => {
    errorAction({ options, response });
    if (!response) {
      return {};
    }
    if (typeof response.data === 'undefined') {
      return response;
    } else if (options.response) {
      return response;
    }
    return response.data;
  };

  return ahooksRequest(requestService, {
    requestMethod: (params) => {
      return ajaxService({
        ...config,
        ...params,
      });
    },
    formatResult,
    ...options,
  });
};
export default useRequest;
