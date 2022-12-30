import React, { useState } from 'react';
import MyCard from '../../../../components/MyCard';
import { UserName } from '../../../../components/User';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import styles from '../../index.less';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import Label from '../../../../components/Label';
import { Divider, Space } from 'antd-mobile';
import style from '../../../StatisticalChart/index.less';
import LinkButton from '../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../../../util/ToolUtil';
import ShowCode from '../../../../components/ShowCode';

export const maintenanceLog = { url: '/maintenanceLog/detail', method: 'GET' };

const MaintenaceLog = ({ maintenanceLogId }) => {

  const [info, setInfo] = useState({
    brands: [],
    skuResult: {},
    user: {},
  });

  const { loading } = useRequest({
      ...maintenanceLog,
      params: {
        id: maintenanceLogId,
      },
    }, {
      onSuccess: (res) => {
        const detailResults = res.detailResults || [];

        const brands = [];
        let skuResult;

        detailResults.forEach(item => {
          const inkindResult = item.inkindResult || {};
          const inkind = { codeId: inkindResult.qrCodeId, number: inkindResult.number, inkindId: inkindResult.inkindId };
          if (!skuResult) {
            skuResult = inkindResult.skuResult;
          }
          const brandIds = brands.map(item => item.brandId);
          const brandIndex = brandIds.indexOf(item.brandId);
          if (brandIndex === -1) {
            brands.push({
              brandId: item.brandId,
              brandName: ToolUtil.isObject(inkindResult.brand).brandName || '无品牌',
              inkinds: [inkind],
            });
          } else {
            const brand = brands[brandIndex];
            brands[brandIndex] = {
              ...brand,
              inkinds: [...brand.inkinds, inkind],
            };
          }
        });

        setInfo({ skuResult, brands, user: res.createUserResult });
      },
    },
  );

  const [open, setOpen] = useState();

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>

    <MyCard title='养护明细' bodyStyle={{ padding: '8px 0' }}>
      <div className={styles.sku}>
        <SkuItem
          skuResult={info.skuResult}
          className={styles.skuItem}
          extraWidth='90px'
          otherData={[]}
        />
        <ShopNumber show value={1} />
      </div>
      <div className={styles.content}>
        <div>
          <Label className={styles.label}>养护内容</Label>:
        </div>
        <div>
          <Label className={styles.label}>照片</Label>:
        </div>
        <div>
          <Label className={styles.label}>备注</Label>:
        </div>
      </div>

      <div>
        <Divider contentPosition='left'>品牌明细</Divider>
        {
          info.brands.map((item, index) => {
            const inkinds = item.inkinds || [];
            return <MyCard
              className={style.card}
              headerClassName={style.header}
              bodyClassName={style.errorBody}
              titleBom={<>{item.brandName} × {inkinds.length}</>}
              key={index}
              extra={<LinkButton onClick={() => {
                if (open === index) {
                  setOpen(null);
                  return;
                }
                setOpen(index);
              }}>
                <Space align='center'>
                  明细{open !== index ? <UpOutline /> : <DownOutline />}
                </Space>
              </LinkButton>}
            >
              <div hidden={open !== index} style={{ padding: '0 8px' }}>
                {
                  inkinds.map((item, index) => {
                    return <div
                      key={index}
                      style={{ border: index === 1 ? 'none' : '' }}
                      className={ToolUtil.classNames(style.flexCenter, style.skuItem)}
                    >
                      实物码：
                      {item.codeId.substring(item.codeId.length - 6,item.codeId.length)}
                     <span style={{padding:'0 8px'}}> <ShowCode code={item.codeId} inkindId={item.inkindId} /></span>
                      × {item.number}
                    </div>;
                  })
                }
              </div>
            </MyCard>;
          })
        }
      </div>

    </MyCard>

    <MyCard title='执行人' extra={<UserName user={info.user} />} />

    <MyCard title='来源' extra='无' />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default MaintenaceLog;
