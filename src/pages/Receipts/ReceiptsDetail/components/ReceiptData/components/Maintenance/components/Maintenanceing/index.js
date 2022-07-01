import React, { useEffect, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import LinkButton from '../../../../../../../../components/LinkButton';
import Icon from '../../../../../../../../components/Icon';
import style from './index.less';
import MyCheck from '../../../../../../../../components/MyCheck';
import { Stepper } from 'antd-mobile';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { CameraOutline } from 'antd-mobile-icons';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../components/Message';
import { useRequest } from '../../../../../../../../../util/Request';
import MyStepper from '../../../../../../../../components/MyStepper';

export const maintenanceLogAdd = { url: '/maintenanceLog/add', method: 'POST' };

const Maintenanceing = (
    {
      skuItem = {},
      onSuccess = () => {
      },
    },
  ) => {

    const [brands, setBrands] = useState([]);

    const completeBrands = brands.filter(item => item.checked && item.curingNumber > 0);

    const { loading: maintenanceLogLoading, run: maintenanceLogRun } = useRequest(maintenanceLogAdd,
      {
        manual: true,
        onSuccess: () => {
          onSuccess();
          Message.toast('养护成功！');
        },
        onError: () => {
          Message.toast('养护失败！');
        },
      });

    const [files, setFiles] = useState([]);

    useEffect(() => {
      const brands = skuItem.brandResults || [];
      if (brands.length === 1) {
        const brand = brands[0] || {};
        setBrands([{ ...brand, curingNumber: brand.number, checked: true }]);
      } else {
        setBrands(brands.map(item => {
          return {
            ...item,
            curingNumber: item.number,
          };
        }));
      }
    }, []);

    const brandsChange = (data, currentIndex) => {
      const newBrands = brands.map((item, index) => {
        if (index === currentIndex) {
          return { ...item, ...data };
        } else {
          return item;
        }
      });
      setBrands(newBrands);
    };

    return <div style={{ paddingBottom: 60 }}>
      <div className={style.skuItem}>
        <div className={style.sku}>
          <SkuItem extraWidth='94px' skuResult={skuItem} otherData={[skuItem.positionName]} />
        </div>
        <div className={style.actions}>
          <div className={style.sop}>
            <LinkButton>养护指导</LinkButton>
          </div>
          <div>
            <Icon type='icon-dibudaohang-saoma' style={{ fontSize: 24 }} />
          </div>
        </div>
      </div>

      <div className={style.brands}>
        {
          brands.map((item, index) => {
            const checked = item.checked;
            return <div key={index} className={style.brandItem}>
              <div className={style.brand} onClick={() => {
                brandsChange({ checked: !checked }, index);
              }}>
                <MyCheck fontSize={22} checked={checked} />
                <span>{item.brandName}</span>
                <span>({item.number})</span>
              </div>
              <div hidden={!checked}>
                <MyStepper
                  max={item.number}
                  min={1}
                  value={item.curingNumber}
                  onChange={(curingNumber) => {
                    brandsChange({ curingNumber }, index);
                  }}
                />
              </div>

            </div>;
          })
        }
      </div>

      <div className={style.phone}>
        <div className={style.title}>养护现场</div>
        <UploadFile
          imgSize={36}
          icon={<CameraOutline />}
          noFile
          onChange={(mediaIds) => {
            setFiles(mediaIds);
          }}
        />
      </div>

      <BottomButton disabled={completeBrands.length === 0} only onClick={() => {
        maintenanceLogRun({
          data: {
            enclosure: files,
            maintenanceLogParams: completeBrands.map(item => {
              return {
                brandId: item.brandId,
                storehousePositionsId: skuItem.positionId,
                skuId: skuItem.skuId,
                number: item.curingNumber,
              };
            }),
          },
        });
      }} />

      {maintenanceLogLoading && <MyLoading />}
    </div>;
  }
;

export default Maintenanceing;
