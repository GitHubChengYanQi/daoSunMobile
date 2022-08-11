import MyNavBar from '../../components/MyNavBar';
import MyCard from '../../components/MyCard';
import { DownOutline } from 'antd-mobile-icons';
import style from '../StatisticalChart/index.less';
import LinkButton from '../../components/LinkButton';
import { ToolUtil } from '../../components/ToolUtil';
import SkuItem from '../../Work/Sku/SkuItem';
import React from 'react';
import MaterialAnalysis from '../components/MaterialAnalysis';
import ShopNumber from '../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';


const MaterialAnalysisData = () => {


  return <>
    <MyNavBar title='物料分析' />
    <MyCard title='分析图表'>
      <MaterialAnalysis />
    </MyCard>

    <MyCard title='结果明细'>
      {
        ['数控车床 / HTC2050i / 500*1000', 'qwu98qey87eqw'].map((item, index) => {
          return <MyCard
            className={style.card}
            headerClassName={style.header}
            bodyClassName={style.body}
            titleBom={item}
            key={index}
            extra={<>可生产 <span className='numberBlue'>2</span>台</>}
          >
            {
              [1, 2, 3].map((item, index) => {
                return <div key={index}>
                  <div className={ToolUtil.classNames(style.flexCenter, style.skuItem)}>
                    <div className={style.row}>{item}</div>
                    <LinkButton>展开 <DownOutline /></LinkButton>
                  </div>
                  {
                    [1, 2].map((item, index) => {
                      return <div
                        key={index}
                        style={{ border: 'none' }}
                        className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                      >
                        <SkuItem imgSize={45} className={style.row} />
                        <ShopNumber show value={2} />
                      </div>;
                    })
                  }
                </div>;
              })
            }
          </MyCard>;
        })
      }
    </MyCard>
  </>;
};

export default MaterialAnalysisData;
