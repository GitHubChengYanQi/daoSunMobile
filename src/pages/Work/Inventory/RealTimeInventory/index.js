import React, { useEffect, useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import scanImg from '../../../../assets/scan.png';
import style from './index.less';
import { useHistory } from 'react-router-dom';
import { connect } from 'dva';
import { ToolUtil } from '../../../../util/ToolUtil';
import { MyLoading } from '../../../components/MyLoading';
import { Message } from '../../../components/Message';
import { ClockCircleOutline } from 'antd-mobile-icons';
import MyList from '../../../components/MyList';
import { MyDate } from '../../../components/MyDate';
import MyPositions from '../../../components/MyPositions';
import { ScanIcon } from '../../../components/Icon';
import ListScreent from '../../Sku/SkuList/components/ListScreent';
import Title from '../../../components/Title';
import StocktakScreen from './components/StocktakScreen';
import KeepAlive from '../../../../components/KeepAlive';

export const inventoryPageList = { url: '/inventory/pageList', method: 'POST' };

const RealTimeInventoryContent = connect(({ qrCode }) => ({ qrCode }))((props) => {

  const [scrollTop, setScrollTop] = useState(0);

  const [positionVisible, setPositionVisible] = useState();

  const [position, setPosition] = useState({});

  const history = useHistory();

  const qrCode = ToolUtil.isObject(props.qrCode);

  const codeId = qrCode.codeId;

  const [data, setData] = useState([]);

  const [number, setNumber] = useState(0);

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

  const [screen, setScreen] = useState();
  const [screening, setScreeing] = useState();
  const screenRef = useRef();
  const listRef = useRef();
  const ref = useRef();

  const [params, setParams] = useState({});

  const submit = (data = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    setScreeing(true);
    ref.current.submit(newParmas);
  };


  const clear = () => {
    setParams();
    ref.current.submit();
  };

  return <div
    id='content'
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}>
    <MyNavBar title='即时盘点' />

    <div onClick={() => {
      setPositionVisible(true);
    }}>
      <div style={{ pointerEvents: 'none' }}>
        <MySearch placeholder='请搜索库位进行盘点' />
      </div>
    </div>


    <div className={style.scan}>
      <div className={style.scanImg}>
        <img src={scanImg} alt='' width={60} height={60} />
      </div>
      <div className={style.scanTitle}>
        请打开手机摄像头或使用手持终端扫描按键扫描库位码进行盘点
      </div>
    </div>

    <ListScreent
      top={ToolUtil.isQiyeWeixin() ? 0 : 45}
      numberTitle={<Title className={style.title}>盘点记录</Title>}
      screening={screening}
      listRef={listRef}
      screen={screen}
      screenChange={setScreen}
      screenRef={screenRef}
    />
    <div className={style.inventoryLog}>
      <div ref={listRef}>
        <MyList ref={ref} api={inventoryPageList} getData={setData} data={data}
                response={(res) => setNumber(res.count)}>
          <div className={style.logs}>
            {
              data.map((item, index) => {
                return <div key={index} onClick={() => {
                  history.push(`/Work/Inventory/RealTimeInventory/Detail?inventoryTaskId=${item.inventoryTaskId}`);
                }}>
                  <div style={{ paddingTop: 8 }}>
                    库位：{ToolUtil.isObject(item.positionsResult).name}
                  </div>
                  <div className={style.logData}>
                    <div>
                      盘点人员：{ToolUtil.isObject(item.user).name}
                    </div>
                    <div>
                      <ClockCircleOutline /> {MyDate.Show(item.createTime)}
                    </div>
                  </div>
                </div>;
              })
            }
          </div>
        </MyList>
      </div>
    </div>

    <div className={style.stocktakingButtom} onClick={() => {
      props.dispatch({
        type: 'qrCode/wxCpScan',
        payload: {
          action: 'position',
        },
      });
    }}>
      <ScanIcon />
    </div>

    <MyPositions
      afterClose={() => {
        if (position.id) {
          history.push(`/Work/Inventory/RealTimeInventory/PositionInventory?positionId=${position.id}`);
        }
      }}
      visible={positionVisible}
      single
      autoFocus
      value={[position]}
      onClose={() => setPositionVisible(false)}
      onSuccess={(value = []) => {
        setPositionVisible(false);
        setPosition(value[0] || {});
      }} />

    <StocktakScreen
      getContainer={document.getElementById('content')}
      skuNumber={number}
      onClose={() => {
        setScreen(false);
        ToolUtil.isObject(listRef.current).removeAttribute('style');
      }}
      params={params}
      onClear={clear}
      screen={screen}
      onChange={(params) => {
        submit(params);
      }} />
    {qrCode.loading && <MyLoading />}
  </div>;

});


const RealTimeInventory = () => {
  return <KeepAlive id='message' contentId='content'>
    <MyNavBar title='消息' noDom />
    <RealTimeInventoryContent />
  </KeepAlive>;
};

export default RealTimeInventory;
