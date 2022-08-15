import MyNavBar from '../../components/MyNavBar';
import MyCard from '../../components/MyCard';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import style from '../StatisticalChart/index.less';
import LinkButton from '../../components/LinkButton';
import { ToolUtil } from '../../components/ToolUtil';
import SkuItem from '../../Work/Sku/SkuItem';
import React, { useState } from 'react';
import MaterialAnalysis from '../components/MaterialAnalysis';
import ShopNumber from '../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';

export const BomDetailed = { url: '/asynTask/BomDetailed', method: 'POST' };

const MaterialAnalysisData = () => {

  const [data, setData] = useState([]);

  const { loading } = useRequest(BomDetailed, {
    onSuccess: (res) => {
      const newData = [];
      ToolUtil.isArray(res).forEach(item => {
        const allBomResult = item.allBomResult || {};
        const view = ToolUtil.isArray(allBomResult.view)[0] || {};
        const owe = allBomResult.owe || [];
        const spuClass = [];

        owe.forEach(item => {
          const spuClassNames = spuClass.map(item => item.name);
          const spuClassIndex = spuClassNames.indexOf(item.spuClass);
          if (spuClassIndex === -1) {
            spuClass.push({
              name: item.spuClass,
              skus: [item],
            });
          } else {
            const spuClassItem = spuClass[spuClassIndex] || {};
            spuClass[spuClassIndex] = {
              ...spuClassItem,
              skus: [...spuClassItem.skus, item],
            };
          }
        });

        newData.push({
          name: view.name,
          num: view.num,
          spuClass,
        });
      });
      setData(newData);
    },
  });
  // console.log(data);

  if (loading) {
    return <MyLoading skeleton />;
  }


  return <>
    <MyNavBar title='物料分析' />
    <MyCard title='分析图表'>
      <MaterialAnalysis />
    </MyCard>

    <MyCard title='结果明细'>
      {
        data.map((item, skuIndex) => {
          const spuClass = item.spuClass || [];
          return <MyCard
            className={style.card}
            headerClassName={style.header}
            bodyClassName={style.body}
            titleBom={item.name}
            key={skuIndex}
            extra={<>可生产 <span className='numberBlue'>{item.num}</span>台</>}
          >
            {
              spuClass.map((item, spuClassIndex) => {
                const skus = item.skus || [];
                return <div key={spuClassIndex}>
                  <div
                    style={{ border: spuClassIndex === spuClass.length - 1 && 'none' }}
                    className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                  >
                    <div className={style.row}>{item.name} ({skus.length})</div>
                    <LinkButton onClick={() => {
                      const newData = data.map((item, index) => {
                        if (index === skuIndex) {
                          const spuClass = item.spuClass || [];
                          const newSpuClass = spuClass.map((item, index) => {
                            if (index === spuClassIndex) {
                              return { ...item, open: !item.open };
                            }
                            return item;
                          });
                          return { ...item, spuClass: newSpuClass };
                        }
                        return item;
                      });

                      setData(newData);
                    }}>{!item.open ? <>展开<UpOutline /></> : <>收起<DownOutline /></>}</LinkButton>
                  </div>
                  <div hidden={!item.open}>
                    {
                      skus.map((item, index) => {
                        return <div
                          key={index}
                          style={{ border: 'none' }}
                          className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                        >
                          <SkuItem
                            skuResult={{ skuId: item.skuId, skuName: item.skuName, spuResult: { name: item.spuName } }}
                            imgSize={45}
                            className={style.row}
                          />
                          <ShopNumber show value={item.lackNumber} />
                        </div>;
                      })
                    }
                  </div>

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
