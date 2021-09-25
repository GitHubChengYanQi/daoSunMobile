import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css'

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
