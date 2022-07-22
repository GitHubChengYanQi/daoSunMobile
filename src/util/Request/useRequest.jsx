import { useRequest as ahooksRequest } from 'ahooks';
import Service from '../Service';
import cookie from 'js-cookie';
import { ToolUtil } from '../../pages/components/ToolUtil';
import { history } from 'umi';
import { Message } from '../../pages/components/Message';

const useRequest = (config, options = {}) => {
  const { ajaxService } = Service();

  const requestService = (params) => {
    return params || {};
  };

  const formatResult = (response) => {
    const errCode = typeof response.errCode !== 'undefined' ? parseInt(response.errCode, 0) : 0;
    if (![0, 1001].includes(errCode)) {
      if (errCode === 1502) {
        cookie.remove('cheng-token');

        const backUrl = window.location.href;
        if (!ToolUtil.queryString('login', backUrl)) {
          history.push({
            pathname: '/Login',
            query: {
              backUrl,
            },
          });
        }
      } else if (errCode !== 200 && !options.noError) {
        Message.errorDialog({
          content: response.message,
        });
      }
      throw new Error(response.message);
    }

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
