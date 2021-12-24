import { useDebounceEffect } from 'ahooks';
import { connect } from 'dva';
import MyDialog from '../components/MyDialog';

// https://dasheng-soft.picp.vip/#/OrCode?id=1453935045308170242

const OrCode = (props) => {

  const id = props.location.query.id;

  useDebounceEffect(() => {
    if (id) {
      props.dispatch({
        type: 'qrCode/backObject',
        payload: {
          code: id,
        },
      });
    } else {
      props.dispatch({
        type: 'qrCode/wxCpScan',
      });
    }
  }, [], {
    wait: 0,
  });


  return <MyDialog visible={true} />;
};
export default connect(({ qrCode }) => ({ qrCode }))(OrCode);
