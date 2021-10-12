import cookie from 'js-cookie';
import moment from '../../util/Common/moment';
import Base64 from 'crypto-js/enc-base64';
import utf8 from 'crypto-js/enc-utf8';
import { router } from 'umi';


const GetUserInfo = () => {
  const token = cookie.get('cheng-token');
  /**
   * token 不存在就返回空
   */
  if (!token) {
    return {};
  }

  try {
    const [pre, data] = token.split('.');

    const base = Base64.parse(data);

    const userInfo = base.toString(utf8);
    if (userInfo.split(',')[5].split(':')[1] === 'null'){
      router.push('/Login');
    }

    /**
     * token 过期就返回空
     */
    if (moment().format('X') > userInfo.exp) {
      return {}
    }
    return {
      token,
      userInfo
    }

  }catch (e) {
    return {}
  }

}
export default GetUserInfo;
