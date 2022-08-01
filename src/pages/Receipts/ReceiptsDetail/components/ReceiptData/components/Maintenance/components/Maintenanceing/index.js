import React, { useEffect, useRef, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import LinkButton from '../../../../../../../../components/LinkButton';
import { ScanIcon } from '../../../../../../../../components/Icon';
import style from './index.less';
import MyCheck from '../../../../../../../../components/MyCheck';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { CameraOutline } from 'antd-mobile-icons';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../components/Message';
import { useRequest } from '../../../../../../../../../util/Request';
import MyStepper from '../../../../../../../../components/MyStepper';
import InkindList from '../../../../../../../../components/InkindList';

export const maintenanceLogAdd = { url: '/maintenanceLog/add', method: 'POST' };

const Maintenanceing = (
  {
    maintenanceId,
    skuItem = {},
    onSuccess = () => {
    },
  },
) => {

  const inkindRef = useRef();

  const [brands, setBrands] = useState([]);
  console.log(brands);

  const completeBrands = brands.filter(item => item.checked && item.curingNumber > 0);

  const { loading: maintenanceLogLoading, run: maintenanceLogRun } = useRequest(maintenanceLogAdd,
    {
      manual: true,
      onSuccess: () => {
        Message.successToast('养护成功！', () => {
          onSuccess({
            positionId: skuItem.positionId,
            skuId: skuItem.skuId,
            brands: completeBrands.map(item => {
              return {
                brandId: item.brandId,
                number: item.curingNumber,
              };
            }),
          });
        });
      },
      onError: () => Message.errorToast('养护失败！'),
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

  const submit = (completeBrands) => {
    maintenanceLogRun({
      data: {
        maintenanceId,
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
  };

  return <div style={{ paddingBottom: 60, maxWidth: '80vh', overflow: 'hidden' }}>
    <div className={style.skuItem}>
      <div className={style.sku}>
        <SkuItem extraWidth='94px' skuResult={skuItem.skuResult} otherData={[skuItem.positionName]} />
      </div>
      <div className={style.actions}>
        <div hidden className={style.sop}>
          <LinkButton>养护指导</LinkButton>
        </div>
        <div>
          <ScanIcon style={{ fontSize: 24 }} onClick={() => {
            inkindRef.current.open({
              skuId: skuItem.skuId,
              positionId: skuItem.positionId,
              skuResult: skuItem.skuResult,
              maintenanceId,
            });
          }} />
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

    <InkindList
      ref={inkindRef}
      onSuccess={(inkinds = []) => {
        const completeBrands = inkinds.map(item => {
          return {
            brandId: item.brandId,
            storehousePositionsId: item.storehousePositionsId,
            skuId: item.skuId,
            number: item.number,
          };
        });
        submit(completeBrands);
      }}
    />

    <BottomButton disabled={completeBrands.length === 0} only onClick={() => {
      submit(completeBrands);
    }} />

    {maintenanceLogLoading && <MyLoading />}
  </div>;
};

export default Maintenanceing;
