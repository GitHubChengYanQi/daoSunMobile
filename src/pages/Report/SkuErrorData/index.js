import React from 'react';
import MyCard from '../../components/MyCard';
import MyNavBar from '../../components/MyNavBar';
import LinkButton from '../../components/LinkButton';
import style from '../StatisticalChart/index.less';
import ErrorSku from '../components/ErrorSku';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import SkuItem from '../../Work/Sku/SkuItem';
import { ToolUtil } from '../../components/ToolUtil';

const SkuErrorData = () => {


  return <>
    <MyNavBar title='异常分析' />
    <MyCard title='分析图表' extra={<div>2022年 <RightOutline /></div>}>
      <ErrorSku />
    </MyCard>

    <MyCard title='异常明细'>
      {
        ['1月', '2月'].map((item, index) => {
          return <MyCard
            className={style.card}
            headerClassName={style.header}
            bodyClassName={style.body}
            titleBom={<>{item} 提报 <span>7</span> 次</>}
            key={index}
            extra={<LinkButton>展开 <DownOutline /></LinkButton>}
          >
            {
              [1, 2].map((item, index) => {
                return <div
                  key={index}
                  style={{ border: index === 1 ? 'none' : '' }}
                  className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                >
                  <SkuItem imgSize={45} className={style.row} />
                  <LinkButton>详情</LinkButton>
                </div>;
              })
            }
          </MyCard>;
        })
      }
    </MyCard>
  </>;
};

export default SkuErrorData;
