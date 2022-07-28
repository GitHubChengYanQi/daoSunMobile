import React, { useEffect, useState } from 'react';
import MyCard from '../../../../../../components/MyCard';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { useBoolean } from 'ahooks';
import { Divider } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import Title from '../../../../../../components/Title';
import LinkButton from '../../../../../../components/LinkButton';
import MyAntPopup from '../../../../../../components/MyAntPopup';
import MyEmpty from '../../../../../../components/MyEmpty';
import Viewpager from '../InstockOrder/components/Viewpager';
import AllocationSkuItem from './components/AllocationSkuItem';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { getEndData, getStartData } from './getData';

const Allocation = (
  {
    data,
    getAction = () => {

    },
    permissions,
  },
) => {

  const history = useHistory();

  const [total, setTotal] = useState(0);

  const [allSku, { toggle }] = useBoolean();

  const assign = getAction('assign').id && permissions;
  const carryAllocation = getAction('carryAllocation').id && permissions;

  const [detailShow, setDetailShow] = useState();

  const [visible, setVisible] = useState();

  const [skus, setSkus] = useState([]);


  useEffect(() => {
    const skus = getEndData(getStartData(data.detailResults), data.allocationCartResults);
    setSkus(skus);
    let number = 0;
    skus.forEach(item => number += item.number);
    setTotal(number);
  }, []);

  return <>
    <MyCard
      titleBom={<div className={style.header}>
        <Title>任务明细</Title>
        <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          setDetailShow(true);
        }}>详情</LinkButton>
      </div>}
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      extra={<div className={style.extra}>
        合计：
        <div>{skus.length}</div>类
        <div hidden={!total}><span>{total}</span>件</div>
      </div>}>
      {
        skus.map((item, index) => {

          if (!allSku && index >= 3) {
            return null;
          }

          return <AllocationSkuItem
            item={item}
            key={index}
          />;

          return <div key={index}>
            <Viewpager
              currentIndex={index}
              onLeft={() => {
                setVisible(true);
              }}
              onRight={() => {
                setVisible(true);
              }}
            >
              <AllocationSkuItem item={item} key={index} />
            </Viewpager>
          </div>;
        })
      }
      {skus.length > 3 && <Divider className={style.allSku}>
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
    </MyCard>

    <MyCard title='申请类型' extra={data.type === 'allocation' ? '调拨' : '移库'} />
    <MyCard title='调拨类型' extra={data.allocationType === 2 ? '调出' : '调入'} />
    <MyCard title='仓库' extra='无' />
    <MyCard title='注意事项'>
      {[].length === 0 && <div>无</div>}
      {[].map((item, index) => {
        return <div key={index} className={style.carefulShow} style={{ margin: index === 0 && 0 }}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      <div className={style.remake}>{'无'}</div>
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {[].length === 0 && '无'}
        <UploadFile show value={[].map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>

    <MyAntPopup
      title={carryAllocation ? '调拨申请' : '调拨详情'}
      onClose={() => {
        setDetailShow(false);
      }}
      visible={detailShow}
      destroyOnClose
    >
      {/*<div className={style.details}>*/}
      {/*  {showList.length === 0 && <MyEmpty />}*/}
      {/*  {*/}
      {/*    showList.map((item, index) => {*/}
      {/*      return <AllocationSkuItem item={item} key={index} />;*/}
      {/*    })*/}
      {/*  }*/}
      {/*</div>*/}
    </MyAntPopup>

    {assign && <BottomButton
      only
      text='分配调拨物料'
      onClick={() => {
        history.push(`/Work/Allocation/SelectStoreHouse?id=${data.allocationId}`);
      }} />}
  </>;
};

export default Allocation;
