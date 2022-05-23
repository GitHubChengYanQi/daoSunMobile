
import { connect } from 'dva';
import { ToolUtil } from '../components/ToolUtil';

const Scan = (props) => {

  const getScan = () => {

  };

    if (ToolUtil.isQiyeWeixin()) {
      getScan();
    } else {
      window.Android.onScan();
      window.receive = (number) => {
        props.dispatch({
          type: 'qrCode/payload',
          payload: {
            code: number,
          },
        });
      };
    }
    return {};

};

export default connect(({ qrCode }) => ({ qrCode }))(Scan);

