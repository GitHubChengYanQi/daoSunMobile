import React, { useEffect, useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Divider } from 'antd';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import { CheckOutlined, PauseCircleFilled, WarningOutlined } from '@ant-design/icons';
import { Button, Popup } from 'antd-mobile';
import { CameraOutline, DownOutline, UpOutline } from 'antd-mobile-icons';
import Error from '../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../index';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };

const Maintenance = (
  {
    permissions,
    receipts,
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('check').id && permissions;

  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  const [visible, setVisible] = useState();

  const { run: addPhoto } = useRequest(inventoryAddPhoto, { manual: true });
  const { loading: temporaryLockLoading, run: temporaryLockRun } = useRequest(temporaryLock, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  const positionChange = (params, currentIndex) => {
    const newData = data.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...params };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  return <div className={style.stocktaking}>

    <div className={style.title}>
      库位：{data.length}
    </div>

    {
      data.map((positionItem, positionIndex) => {
        const skuResultList = positionItem.skuResultList || [];

        return <div key={positionIndex} className={style.position}>
          <div className={style.title}>
            {positionItem.name} / {ToolUtil.isObject(positionItem.storehouseResult).name || '-'}
          </div>

          <div className={style.skus}>
            {
              skuResultList.map((skuItem, skuIndex) => {
                const brandResults = skuItem.brandResults || [];

                const noComplete = brandResults.filter(item => {
                  return [0, 2].includes(item.inventoryStatus);
                });

                if (!positionItem.show && skuIndex >= 2) {
                  return null;
                }

                const border = (positionItem.show || skuResultList.length <= 2) ? skuIndex === skuResultList.length - 1 : skuIndex === 1;

                return <div
                  className={style.sku}
                  key={skuIndex}
                  style={{ border: border ? 'none' : '' }}>
                  <SkuItem skuResult={skuItem} />
                  <Divider style={{ margin: '8px 0' }} />
                  <div className={style.brands}>
                    {
                      brandResults.map((brandItem, brandIndex) => {
                        let color = '';
                        let icon = <></>;
                        switch (brandItem.inventoryStatus) {
                          case 0:
                            color = '#D9D9D9';
                            break;
                          case 1:
                            color = '#2EAF5D';
                            icon = <CheckOutlined style={{ color: '#2EAF5D' }} />;
                            break;
                          case -1:
                            color = '#FF0000';
                            icon = <WarningOutlined style={{ color: '#FF0000' }} />;
                            break;
                          case 2:
                            color = '#FA8F2B';
                            icon = <PauseCircleFilled style={{ color: '#FA8F2B' }} />;
                            break;
                          default:
                            color = '#D9D9D9';
                            break;
                        }

                        return <div
                          key={brandIndex}
                          className={style.brand}
                          style={{ border: `1px solid ${color}` }}
                          onClick={() => {
                            if (actionPermissions) {
                              setVisible({
                                skuId: skuItem.skuId,
                                skuResult: skuItem,
                                brandId: brandItem.brandId,
                                brandResult: { brandName: brandItem.brandName || '其他品牌' },
                                stockNumber: brandItem.number,
                                number: brandItem.number,
                                inventoryTaskId: receipts.inventoryTaskId,
                                positionId: positionItem.storehousePositionsId,
                                anomalyId: brandItem.anomalyId || false,
                              });
                            }
                          }}
                        >
                          <div className={style.name}>{brandItem.brandName || '其他品牌'}({brandItem.number})</div>
                          {icon}
                        </div>;
                      })
                    }
                  </div>
                  <div className={style.action}>
                    <div className={style.mediaIds}>
                      <UploadFile
                        show={!actionPermissions}
                        value={ToolUtil.isArray(skuItem.mediaIds).map((item, index) => {
                          return {
                            mediaId: item,
                            url: ToolUtil.isArray(skuItem.inventoryUrls)[index],
                            type: 'image',
                            inventoryTaskId: receipts.inventoryTaskId,
                          };
                        })}
                        uploadId={`errorUpload${positionIndex}${skuIndex}`}
                        imgSize={36}
                        icon={<CameraOutline />}
                        noFile
                        onChange={(mediaIds) => {
                          addPhoto({
                            data: {
                              positionId: positionItem.storehousePositionsId,
                              enclosure: mediaIds,
                              skuId: skuItem.skuId,
                              inventoryId: receipts.inventoryTaskId,
                            },
                          });
                        }}
                      />
                    </div>
                    {actionPermissions &&
                    <Button
                      disabled={noComplete.length > 0 || skuItem.lockStatus === 98}
                      color='primary'
                      fill='outline'
                      onClick={() => {
                        temporaryLockRun({
                          data: {
                            positionId: positionItem.storehousePositionsId,
                            skuId: skuItem.skuId,
                            inventoryId: receipts.inventoryTaskId,
                          },
                        });
                      }}
                    >
                      {skuItem.lockStatus === 98 ? '已盘点' : '确定'}
                    </Button>}
                  </div>

                </div>;
              })
            }

            {skuResultList.length > 2 && <Divider style={{ margin: 0 }}>
              <div onClick={() => {
                positionChange({ show: !positionItem.show }, positionIndex);
              }}>
                {
                  positionItem.show ?
                    <UpOutline />
                    :
                    <DownOutline />
                }
              </div>
            </Divider>}
          </div>
        </div>;
      })
    }

    <Popup
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Error
        id={visible && visible.anomalyId}
        type={ReceiptsEnums.stocktaking}
        skuItem={visible}
        onClose={() => {
          setVisible(false);
        }}
        onEdit={refresh}
        refreshOrder={refresh}
        onSuccess={() => {
          refresh();
          setVisible(false);
        }}
      />
    </Popup>

    {temporaryLockLoading && <MyLoading />}

  </div>;
};

export default Maintenance;
