import React, { useEffect, useState } from 'react';
import MyCard from '../../components/MyCard';
import MyNavBar from '../../components/MyNavBar';
import LinkButton from '../../components/LinkButton';
import style from '../StatisticalChart/index.less';
import ErrorSku from '../components/ErrorSku';
import { DownOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../Work/Sku/SkuItem';
import { ToolUtil } from '../../components/ToolUtil';
import MyDatePicker from '../../components/MyDatePicker';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import { Space } from 'antd-mobile';

export const detaile = { url: '/anomaly/detailed', method: 'POST' };

const SkuErrorData = () => {

  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());

  const [data, setData] = useState({});

  const [open, setOpen] = useState();

  const { loading, run } = useRequest(detaile, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const submit = (year) => {
    run({ data: { beginTime: year } });
  };
  useEffect(() => {
    submit(year);
  }, [year]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='异常分析' />
    <MyCard
      title='分析图表'
      extra={<div className={style.flexCenter}>
        <MyDatePicker value={date.setFullYear(year)} precision='year' show={year} onChange={(year) => {
          setYear(year);
        }} />年 <RightOutline />
      </div>}>
      <ErrorSku year={year} setYear={setYear} />
    </MyCard>

    <MyCard title='异常明细'>
      {
        Object.keys(data).map((item, index) => {
          const skus = data[item] || [];
          return <MyCard
            className={style.card}
            headerClassName={style.header}
            bodyClassName={style.errorBody}
            titleBom={<>{item}月 提报 <span>{skus.length}</span> 次</>}
            key={index}
            extra={<LinkButton onClick={() => {
              if (open === index) {
                setOpen(null);
                return;
              }
              setOpen(index);
            }}><Space
              align='center'>{open !== index ? <>展开<UpOutline /></> : <>收起<DownOutline /></>}</Space></LinkButton>}
          >
            <div hidden={open !== index} style={{padding:'0 8px'}}>
              {
                skus.map((item, index) => {
                  return <div
                    key={index}
                    style={{ border: index === 1 ? 'none' : '' }}
                    className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                  >
                    <SkuItem hiddenNumber skuResult={item.skuResult} imgSize={45} className={style.row} />
                    <LinkButton>详情</LinkButton>
                  </div>;
                })
              }
            </div>
          </MyCard>;
        })
      }
    </MyCard>
  </>;
};

export default SkuErrorData;
