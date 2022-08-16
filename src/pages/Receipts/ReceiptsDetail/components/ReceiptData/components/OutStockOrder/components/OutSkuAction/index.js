import React, { useRef, useState } from 'react';
import { Dialog, Divider, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { CheckCircleFill, CheckCircleOutline, DownOutline, UpOutline } from 'antd-mobile-icons';
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

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };

const OutSkuAction = (
  {
    loading,
    order = {},
    pickListsId,
    data = [],
    action,
    refresh = () => {
    },
    dimension = 'order',
    taskId,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const shopRef = useRef();

  const [visible, setVisible] = useState();

  const [picking, setPicking] = useState();

  const [code, setCode] = useState('');
  const imgSrc = jrQrcode.getQrBase64(`${process.env.wxCp}Work/OutStockConfirm?code=${code}`);

  const actions = [];
  const noAction = [];

  let countNumber = 0;

  let allPerpareNumber = 0;

  data.map(item => {
    let perpareNumber = 0;
    ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

    const complete = item.status === 99;
    const prepare = complete ? false : perpareNumber === item.number;

    if (complete || prepare) {
      noAction.push({ ...item, complete, prepare, perpareNumber });
    } else {
      actions.push({ ...item, complete, prepare, perpareNumber });
    }
    allPerpareNumber += perpareNumber;
    return countNumber += (item.number || 0);
  });

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

  const outSkus = [...actions, ...noAction];

  const [allSku, { toggle }] = useBoolean();

  return <div style={{ backgroundColor: '#fff' }}>
    <MyCard
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      titleBom={<div className={style.skuTitle}>
        <Title>申请明细</Title>
      </div>}
      extra={<div className={style.extra}>
        合计：<span>{outSkus.length}</span>类<span>{countNumber}</span>件
      </div>}>
      <MyLoading loading={loading}>
        {outSkus.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
        {
          outSkus.map((item, index) => {

            const complete = item.complete;
            const prepare = item.prepare;

            if (!allSku && index >= 3) {
              return null;
            }

            if (!action || complete || prepare || !item.stockNumber) {
              return <OutSkuItem data={data} item={item} key={index} />;
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
                <OutSkuItem data={data} item={item} key={index} />
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
        <div style={{ position: 'relative', marginTop: 19 }}>
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

  </div>;
};

export default OutSkuAction;
