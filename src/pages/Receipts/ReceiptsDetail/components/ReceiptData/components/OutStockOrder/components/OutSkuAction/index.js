import React, { useRef, useState } from 'react';
import { Dialog, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { CheckCircleFill, } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Viewpager from '../../../InstockOrder/components/Viewpager';
import Prepare from '../Prepare';
import OutStockShop from '../OutStockShop';
import OutSkuItem from './compoennts/OutSkuItem';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
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
import LinkButton from '../../../../../../../../components/LinkButton';
import MySearch from '../../../../../../../../components/MySearch';
import ActionButtons from '../../../../../ActionButtons';
import { useHistory } from 'react-router-dom';
import { OutStockRevoke } from '../../../../../Bottom/components/Revoke';
import MyList from '../../../../../../../../components/MyList';

export const checkCode = { url: '/productionPickLists/checkCode', method: 'GET' };
export const outDetailList = { url: '/productionPickListsDetail/pageList', method: 'POST' };

const OutSkuAction = (
  {
    taskDetail,
    actionNode,
    nodeActions = [],
    logIds = [],
    order = {},
    pickListsId,
    action,
    afertShow = () => {
    },
    dimension = 'order',
    taskId,
    refresh: orderRefresh,
    loading: orderLoading,
  },
) => {

  const history = useHistory();

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const shopRef = useRef();

  const skuListRef = useRef();

  const [data, setData] = useState([]);

  const askData = order.detailResults || [];

  const [params, setParams] = useState({ pickListsId });

  const [countNumber, setCountNumber] = useState();

  const format = (list = []) => {
    let countNumber = 0;
    const array = list.map(item => {
      let perpareNumber = 0;
      ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

      const received = Number(item.receivedNumber) || 0;
      const collectable = Number(perpareNumber) || 0;
      const notPrepared = Number(item.number - collectable - received) || 0;

      countNumber += (item.number || 0);
      return {
        ...item,
        perpareNumber,
        received,
        collectable,
        notPrepared,
        action: !(item.number === received || item.number === (received + collectable) || !item.stockNumber),
      };
    });
    return {
      countNumber,
      array,
    };
  };

  const { loading, run: getOutDetail, refresh: detailRefresh } = useRequest({
    ...outDetailList,
    data: params,
  }, {
    manual: true,
    onSuccess: (res) => {
      const { countNumber, array } = format(ToolUtil.isArray(res), countNumber);

      setCountNumber(countNumber);
      setData(array);
    },
  });

  const refresh = () => {
    orderRefresh();
    detailRefresh();
  };

  const [visible, setVisible] = useState();

  const [positionVisible, setPositionVisible] = useState();

  const [picking, setPicking] = useState();

  const [code, setCode] = useState('');
  const [receivedSkus, setReceivedSkus] = useState([]);
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

  const [showDetail, setShowDetail] = useState();

  const [seacrchValue, setSearchValue] = useState();

  return <div style={{ backgroundColor: '#fff' }}>
    <MyCard
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      titleBom={<div className={style.skuTitle}>
        <Title>出库明细</Title>
        {action && <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          history.push({
            pathname:'/Work/OutStock/BatchPrepare',
            search:``
          })
        }}>一键备料</LinkButton>}
        <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          setShowDetail(true);
        }}>申请明细</LinkButton>
      </div>}
      extra={<div className={style.extra} hidden={data.length === 0}>
        合计：<span>{data.length}</span>类<span>{countNumber || 0}</span>件
      </div>}>
      <MySearch
        extraIcon={<Icon
          style={{ fontSize: 20 }}
          type='icon-pandiankuwei1'
          onClick={() => {
            setPositionVisible(true);
          }} />}
        placeholder='请输入物料名称查询'
        style={{ padding: '8px 12px' }}
        onChange={(value) => {
          console.log(value);
          setSearchValue(value);
        }}
        value={seacrchValue}
      />
      <MyLoading noLoadingTitle title='正在刷新数据，请稍后...' loading={loading || orderLoading}>
        {data.length === 0 &&
        <MyEmpty description={`物料全部出库完成`} image={<Icon style={{ fontSize: 45 }} type='icon-chukuchenggong' />} />}
        <MyList
          ref={skuListRef}
          noEmpty
          api={outDetailList}
          params={params}
          data={data}
          getData={(res) => {
            const { countNumber, array } = format(ToolUtil.isArray(res), countNumber);

            setCountNumber(countNumber);
            setData(array);
          }}>
          {
            data.map((item, index) => {

              // if (!allSku && index >= 3) {
              //   return null;
              // }

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
        </MyList>

        {/*{data.length > 3 && <Divider className={style.allSku}>*/}
        {/*  <div onClick={() => {*/}
        {/*    toggle();*/}
        {/*  }}>*/}
        {/*    {*/}
        {/*      allSku ?*/}
        {/*        <UpOutline />*/}
        {/*        :*/}
        {/*        <DownOutline />*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*</Divider>}*/}
      </MyLoading>
    </MyCard>

    <Popup
      getContainer={null}
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Prepare
        taskId={taskId}
        id={pickListsId}
        skuItem={visible}
        dimension={dimension}
        onSuccess={(detail) => {
          // refresh();
          shopRef.current.jump(() => {
            // refresh();
            const newData = data.map((item) => {
              if (item.pickListsDetailId === detail.pickListsDetailId) {
                return {
                  ...item,
                  notPrepared: item.notPrepared - item.number,
                  collectable: item.collectable + item.number,
                };
              } else {
                return item;
              }
            });
            setData(newData);
          });
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
      id={pickListsId}
      refresh={refresh}
    />}

    {actionNode && <ActionButtons
      taskDetail={taskDetail}
      statusName={order.statusName}
      refresh={refresh}
      afertShow={afertShow}
      taskId={taskId}
      logIds={logIds}
      createUser={taskDetail.createUser}
      permissions
      actions={nodeActions.filter((item) => item.action === 'outStock' ? userInfo.id === order.userId : true)}
      onClick={(value) => {
        switch (value) {
          case 'outStock':
            setPicking(true);
            break;
          case 'revokeAndAsk':
            OutStockRevoke(taskDetail);
            break;
          default:
            break;
        }
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
        onSuccess={(res, checkSku) => {
          setPicking(false);
          setReceivedSkus(checkSku);
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
              // refresh();
              const newData = data.map((item) => {
                const receiveds = receivedSkus.filter(receivedSku => receivedSku.pickListsDetailId === item.pickListsDetailId);
                if (receiveds.length > 0) {
                  let number = 0;
                  receiveds.forEach(item => number += item.outNumber);
                  return { ...item, collectable: item.collectable - number, received: item.received + number };
                } else {
                  return item;
                }
              });
              setData(newData);
            }
            setReceivedSkus([]);
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

    <MyAntPopup
      title='出库申请'
      onClose={() => {
        setShowDetail(false);
      }}
      visible={showDetail}
      destroyOnClose
    >
      <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
        {format(askData).array.map((item, index) => {
          return <OutSkuItem
            ask
            item={item}
            index={index}
            key={index}
            dataLength={askData.length - 1}
          />;
        })}
      </div>
    </MyAntPopup>

    <MyPositions
      title='相关库位'
      showPositionIds={order.positionIds}
      showAll
      empty
      visible={positionVisible}
      single
      autoFocus
      value={params.storehousePositionsId ? [{ id: params.storehousePositionsId }] : []}
      onClose={() => setPositionVisible(false)}
      onSuccess={(value = []) => {
        const positions = value[0] || {};
        setParams({ ...params, storehousePositionsId: positions.id });
        skuListRef.current.submit({ ...params, storehousePositionsId: positions.id });
        // getOutDetail({ data: { ...params, storehousePositionsId: positions.id } });
        setPositionVisible(false);
      }} />

  </div>;
};

export default OutSkuAction;
