import React, { useRef, useState } from 'react';
import { Dialog, Divider, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { CheckCircleFill, DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Viewpager from '../../../InstockOrder/components/Viewpager';
import Prepare from '../Prepare';
import OutStockShop from '../OutStockShop';
import OutSkuItem from './compoennts/OutSkuItem';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
import BottomButton from '../../../../../../../../components/BottomButton';
import { useModel } from 'umi';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import MyPicking from './compoennts/MyPicking';
import { Clock } from '../../../../../../../../components/MyDate';
import PrintCode from '../../../../../../../../components/PrintCode';
import jrQrcode from 'jr-qrcode';
import { useRequest } from '../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import Icon from '../../../../../../../../components/Icon';
import MyPositions from '../../../../../../../../components/MyPositions';

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };
export const outDetailList = { url: '/productionPickListsDetail/noPageList', method: 'POST' };

const OutSkuAction = (
  {
    order = {},
    pickListsId,
    action,
    afertShow = () => {
    },
    dimension = 'order',
    taskId,
    refresh: orderRefresh,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const shopRef = useRef();

  const [data, setData] = useState([]);

  const [params, setParams] = useState({ pickListsId });

  const [countNumber, setCountNumber] = useState();

  const [allPerpareNumber, setAllPerpareNumber] = useState();

  const { loading, run: getOutDetail, refresh } = useRequest({
    ...outDetailList,
    data: params,
  }, {
    onSuccess: (res) => {
      const actions = [];
      const noAction = [];
      const other = [];

      let countNumber = 0;
      let allPerpareNumber = 0;

      ToolUtil.isArray(res).map(item => {
        let perpareNumber = 0;
        ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

        const received = Number(item.receivedNumber) || 0;
        const collectable = Number(perpareNumber) || 0;
        const notPrepared = Number(item.number - collectable - received) || 0;


        if (item.number === received || item.number === (received + collectable) || !item.stockNumber) {
          if (notPrepared > 0) {
            other.push({ ...item, perpareNumber, received, collectable, notPrepared });
          } else {
            noAction.push({ ...item, perpareNumber, received, collectable, notPrepared });
          }
        } else {
          actions.push({ ...item, perpareNumber, received, collectable, notPrepared, action: true });
        }
        allPerpareNumber += perpareNumber;
        return countNumber += (item.number || 0);
      });
      setCountNumber(countNumber);
      setAllPerpareNumber(allPerpareNumber);
      setData([
        ...actions,
        ...other.sort((a, b) => {
          return a.notPrepared - b.notPrepared;
        }),
        ...noAction,
      ]);
    },
  });

  const [visible, setVisible] = useState();

  const [positionVisible, setPositionVisible] = useState();

  const [picking, setPicking] = useState();

  const [code, setCode] = useState('');
  const imgSrc = jrQrcode.getQrBase64(`${process.env.wxCp}Work/OutStockConfirm?code=${code}`);

  const [success, { setTrue, setFalse }] = useBoolean();

  const { run, cancel } = useRequest(checkCode, {
    manual: true,
    pollingInterval: 2000,
    onSuccess: (res) => {
      if (res === false) {
        setTrue();
      }
    },
  });

  const [allSku, { toggle }] = useBoolean();

  return <div style={{ backgroundColor: '#fff' }}>
    <MyCard
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      titleBom={<div className={style.skuTitle}>
        <Title>申请明细</Title>
        <Icon
          type={params.positionId ? 'icon-pandiankuwei1' : 'icon-pandiankuwei'}
          onClick={() => {
            setPositionVisible(true);
          }} />
      </div>}
      extra={<div className={style.extra}>
        合计：<span>{data.length}</span>类<span>{countNumber}</span>件
      </div>}>
      <MyLoading noLoadingTitle title='正在刷新数据，请稍后...' loading={loading}>
        {data.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
        {
          data.map((item, index) => {

            if (!allSku && index >= 3) {
              return null;
            }

            if (!action || !item.action) {
              return <OutSkuItem
                item={item}
                index={index}
                dataLength={(data.length > 3 && !allSku) ? 2 : data.length - 1}
                key={index}
              />;
            }

            return <div key={index}>
              <Viewpager
                currentIndex={index}
                onLeft={() => {
                  setVisible(item);
                }}
                onRight={() => {
                  setVisible(item);
                }}
              >
                <OutSkuItem
                  item={item}
                  index={index}
                  dataLength={(data.length > 3 && !allSku) ? 2 : data.length - 1}
                  key={index}
                />
              </Viewpager>
            </div>;
          })
        }
        {data.length > 3 && <Divider className={style.allSku}>
          <div onClick={() => {
            toggle();
          }}>
            {
              allSku ?
                <UpOutline />
                :
                <DownOutline />
            }
          </div>
        </Divider>}
      </MyLoading>
    </MyCard>

    <Popup
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Prepare
        taskId={taskId}
        id={pickListsId}
        skuItem={visible}
        dimension={dimension}
        onSuccess={(number) => {
          shopRef.current.jump(() => {
            refresh();
          }, number);
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Popup>

    {action && <OutStockShop
      shopRef={shopRef}
      taskId={taskId}
      outType={order.source}
      allPerpareNumber={allPerpareNumber}
      id={pickListsId}
      refresh={refresh}
    />}

    {action && userInfo.id === order.userId
    &&
    <BottomButton
      afertShow={afertShow}
      only
      text='领料'
      onClick={() => {
        setPicking(true);
      }}
    />}

    <MyAntPopup
      title='领料'
      onClose={() => setPicking(false)}
      visible={picking}
      destroyOnClose
    >
      <MyPicking
        pickListsId={pickListsId}
        onSuccess={(res) => {
          setPicking(false);
          setCode(res);
        }}
      />
    </MyAntPopup>

    <Dialog
      afterClose={cancel}
      afterShow={() => {
        run({ params: { code } });
        setFalse();
      }}
      visible={code}
      className={style.codeDialog}
      content={<div style={{ textAlign: 'center' }}>
        <div className={style.codeTitle}>领料码</div>
        <div style={{ position: 'relative', paddingTop: 19 }}>
          <div className={style.code}>{code}</div>
          {code && !success && <div className={style.time}>失效剩余时间：<Clock seconds={600} /></div>}
          <img src={imgSrc} alt='' width={187} />
          <div hidden={!success} className={style.getCodeSuccess}>
            <CheckCircleFill />
            领取成功！
          </div>
        </div>
      </div>}
      actions={[[
        { text: '关闭', key: 'close' },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            if (success) {
              refresh();
              orderRefresh();
            }
            setCode('');
            return;
          case 'print':
            PrintCode.print([`<img src={${imgSrc}} alt='' />`], 0);
            return;
          default:
            return;
        }
      }}
    />

    <MyPositions
      showPositionIds={order.positionIds}
      showAll
      empty
      visible={positionVisible}
      single
      autoFocus
      value={params.positionId ? [{ id: params.positionId }] : []}
      onClose={() => setPositionVisible(false)}
      onSuccess={(value = []) => {
        const positions = value[0] || {};
        setParams({ ...params, positionId: positions.id });
        getOutDetail({ data: { ...params, storehousePositionsId: positions.id } });
        setPositionVisible(false);
      }} />

  </div>;
};

export default OutSkuAction;
