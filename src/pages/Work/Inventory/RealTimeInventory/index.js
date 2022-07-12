import React, { useEffect, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import Positions
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { Popup, Space } from 'antd-mobile';
import scanImg from '../../../../assets/scan.png';
import style from './index.less';
import { useHistory } from 'react-router-dom';
import { connect } from 'dva';
import LinkButton from '../../../components/LinkButton';
import { ToolUtil } from '../../../components/ToolUtil';
import { MyLoading } from '../../../components/MyLoading';
import { Message } from '../../../components/Message';
import { ClockCircleOutline } from 'antd-mobile-icons';
import MyCard from '../../../components/MyCard';
import MyList from '../../../components/MyList';

export const inventoryPageList = { url: '/inventory/pageList', method: 'POST' };

const RealTimeInventory = (props) => {

  const [positionVisible, setPositionVisible] = useState();

  const [position, setPosition] = useState({});

  const history = useHistory();

  const qrCode = ToolUtil.isObject(props.qrCode);

  const codeId = qrCode.codeId;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (codeId) {
      const backObject = qrCode.backObject || {};
      props.dispatch({
        type: 'qrCode/clearCode',
      });
      if (backObject.type === 'storehousePositions') {
        const result = ToolUtil.isObject(backObject.result);
        if (result.storehousePositionsId) {
          history.push(`/Work/Inventory/RealTimeInventory/PositionInventory?positionId=${result.storehousePositionsId}`);
        } else {
          Message.errorToast('获取库位码失败!');
        }
      } else {
        Message.errorToast('请扫描库位码!');
      }
    }
  }, [codeId]);

  return <>
    <MyNavBar title='即时盘点' />

    <MySearch id='search' placeholder='请搜索库位进行盘点' onFocus={() => {
      const search = document.querySelector('#search input');
      search.blur();
      setPositionVisible(true);
    }} />

    <div className={style.scan}>
      <div className={style.scanImg}>
        <img src={scanImg} alt='' width={60} height={60} />
      </div>
      <div className={style.scanTitle}>
        请
        <LinkButton onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'position',
            },
          });
        }}>打开手机摄像头</LinkButton>
        或使用手持终端扫描按键扫描库位码进行盘点
      </div>
    </div>

    <div className={style.inventoryLog}>
      <div>盘点记录</div>
      <MyList api={inventoryPageList} getData={setData} data={data}>
        <div className={style.logs}>
          {
            data.map((item, index) => {
              return <MyCard style={{padding:0}} noHeader key={index} onClick={() => {
                history.push(`/Work/Inventory/RealTimeInventory/Detail?inventoryTaskId=${item.inventoryTaskId}`);
              }}>
                <div>
                  库位：{ToolUtil.isObject(item.positionsResult).name}
                </div>
                <Space>
                  <div>
                    盘点人员：{ToolUtil.isObject(item.positionsResult).name}
                  </div>
                  <div>
                    <ClockCircleOutline /> {item.createTime}
                  </div>
                </Space>
              </MyCard>;
            })
          }
        </div>
      </MyList>
    </div>


    <Popup
      visible={positionVisible}
      destroyOnClose
      afterClose={() => {
        if (position.id) {
          history.push(`/Work/Inventory/RealTimeInventory/PositionInventory?positionId=${position.id}`);
        }
      }}
    >
      <Positions
        showAll
        single
        autoFocus
        ids={[position]}
        onClose={() => setPositionVisible(false)}
        onSuccess={(value = []) => {
          setPositionVisible(false);
          setPosition(value[0] || {});
        }} />
    </Popup>

    {qrCode.loading && <MyLoading />}
  </>;

};

export default connect(({ qrCode }) => ({ qrCode }))(RealTimeInventory);
