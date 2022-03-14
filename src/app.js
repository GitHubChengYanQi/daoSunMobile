import 'antd/dist/antd.css';
import VConsole from 'vconsole';
new VConsole();
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
