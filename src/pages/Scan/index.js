
import { isQiyeWeixin } from '../components/GetHeader';
import { connect } from 'dva';

const Scan = (props) => {

  const getScan = () => {

  };

    if (isQiyeWeixin()) {
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

