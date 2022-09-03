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
import { Space } from 'antd-mobile';

export const BomDetailed = { url: '/asynTask/v1.1.1/BomDetailed', method: 'POST' };
export const bomResult = { url: '/asynTask/v1.1.1/bomResult', method: 'GET' };

const MaterialAnalysisData = () => {

  const [data, setData] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const { loading } = useRequest(BomDetailed, {
    onSuccess: (res) => {
      const newData = [];
      ToolUtil.isArray(res).forEach(item => {
        const sku = item.result[0] || {};
        newData.push({
          skuResult: sku.skuResult,
          num: item.num,
          skuId: sku.skuId,
        });
      });
      setData(newData);
    },
  });

  const dataChange = (params = {}, index = currentIndex) => {
    const newData = data.map((item, dataIndex) => {
      if (dataIndex === index) {
        return { ...item, ...params };
      }
      return item;
    });

    setData(newData);
  };

  const dataClassChange = (params = {}, dataIndex, classIndex) => {
    const newData = data.map((item, index) => {
      if (dataIndex === index) {
        const spuClass = item.spuClass || [];
        const newSpuClass = spuClass.map((item, index) => {
          if (index === classIndex) {
            return { ...item, ...params };
          }
          return item;
        });
        return { ...item, spuClass: newSpuClass };
      }
      return item;
    });

    setData(newData);
  };

  const { run: getBoms } = useRequest(bomResult, {
    manual: true,
    onSuccess: (res) => {
      const spuClass = [];
      ToolUtil.isArray(res).map((item) => {
        const skuResult = item.skuResult || {};
        const spuResult = skuResult.spuResult || {};
        const spuClassificationResult = spuResult.spuClassificationResult || {};
        const spuClassId = spuResult.spuClassificationId;
        const spuClassName = spuClassificationResult.name;
        const spuClassIds = spuClass.map(item => item.spuClassId);
        const spuClassIndex = spuClassIds.indexOf(spuClassId);
        if (spuClassIndex === -1) {
          spuClass.push({
            spuClassId,
            spuClassName,
            num: 1,
            boms: [{ skuResult, number: item.number }],
          });
        } else {
          const spu = spuClass[spuClassIndex];
          spuClass[spuClassIndex] = {
            ...spu,
            num: spu.num + 1,
            boms: [...spu.boms, { skuResult, number: item.number }],
          };
        }
      });
      dataChange({ spuClass, loading: false });
    },
  });

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
            titleBom={<SkuItem extraWidth='150px' skuResult={item.skuResult} />}
            key={skuIndex}
            extra={<Space direction='vertical' align='end'>
              <div>可生产 <span className='numberBlue'>{item.num}</span>台</div>
              <LinkButton onClick={() => {
                dataChange({ loading: true, open: !item.open }, skuIndex);
                if (!item.open) {
                  setCurrentIndex(skuIndex);
                  getBoms({ params: { skuId: item.skuId } });
                }
              }}>{!item.open ? <>展开<UpOutline /></> : <>收起<DownOutline /></>}</LinkButton>
            </Space>}
          >
            {item.open && <div>
              {
                item.loading ? <MyLoading skeleton /> : spuClass.map((item, spuClassIndex) => {
                  const boms = item.boms || [];
                  return <div key={spuClassIndex}>
                    <div
                      style={{ border: spuClassIndex === spuClass.length - 1 && 'none' }}
                      className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                    >
                      <div className={style.row}>{item.spuClassName} ({item.num})</div>
                      <LinkButton onClick={() => {
                        dataClassChange({ open: !item.open }, skuIndex, spuClassIndex);
                      }}>{!item.open ? <>展开<UpOutline /></> : <>收起<DownOutline /></>}</LinkButton>
                    </div>
                    {item.open && <div>
                      {
                        boms.map((item, index) => {
                          return <div
                            key={index}
                            style={{ border: 'none' }}
                            className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                          >
                            <SkuItem
                              skuResult={item.skuResult}
                              imgSize={45}
                              className={style.row}
                            />
                            <ShopNumber show value={item.number} />
                          </div>;
                        })
                      }
                    </div>}

                  </div>;
                })
              }
            </div>}
          </MyCard>;
        })
      }
    </MyCard>
  </>;
};

export default MaterialAnalysisData;
