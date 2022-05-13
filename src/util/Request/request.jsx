import {request as requestProivde} from '../Service';

const request = async (config) => {

  // const {ajaxService} = Service();
  // try {
    const response = await requestProivde({
      ...config
    });
    return response.data;
  // }catch (e) {
  //   return {};
  // }

};
export default request;
