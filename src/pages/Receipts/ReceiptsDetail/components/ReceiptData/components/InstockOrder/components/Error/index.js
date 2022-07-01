import React, { useEffect, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { Button, Divider, Space, Stepper, TextArea } from 'antd-mobile';
import { AddOutline, CameraOutline, CloseOutline, SystemQRcodeOutline } from 'antd-mobile-icons';
import Icon from '../../../../../../../../components/Icon';
import Careful from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/InstockSkus/components/Careful';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { useRequest } from '../../../../../../../../../util/Request';
import { batchBind } from '../../../../../../../../Scan/InStock/components/Url';
import { useModel } from 'umi';
import { SkuResultSkuJsons } from '../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../components/Message';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import LinkButton from '../../../../../../../../components/LinkButton';
import { connect } from 'dva';
import { ReceiptsEnums } from '../../../../../../../index';
import BottomButton from '../../../../../../../../components/BottomButton';
import MyRemoveButton from '../../../../../../../../components/MyRemoveButton';
import MyStepper from '../../../../../../../../components/MyStepper';

const instockError = { url: '/anomaly/add', method: 'POST' };
const anomalyTemporary = { url: '/anomaly/temporary', method: 'POST' };
export const instockErrorDetail = { url: '/anomaly/detail', method: 'POST' };
const instockErrorEdit = { url: '/anomaly/edit', method: 'POST' };
const instockErrorDelete = { url: '/anomaly/delete', method: 'POST' };

const Error = (
  {
    id,
    noDelete,
    skuItem = {},
    onClose = () => {
    },
    onEdit = () => {
    },
    onSuccess = () => {
    },
    refreshOrder = () => {
    },
    maxHeight = '80vh',
    type,
    ...props
  },
) => {

  const [sku, setSku] = useState(skuItem);


  useEffect(() => {
    setSku(skuItem);
  }, [skuItem.skuId]);

  const [data, setData] = useState({ number: skuItem.number });

  const [inkinds, setInkinds] = useState([]);

  let allNumber = 0;
  inkinds.map((item) => allNumber += item.number);

  const { loading: anomalyLoading, run: anomalyRun } = useRequest(instockError, {
    manual: true,
    onSuccess: () => {
      onSuccess(skuItem);
      switch (type) {
        case ReceiptsEnums.instockOrder:
          addShop();
          break;
        case ReceiptsEnums.stocktaking:
          Message.toast('添加成功！');
          break;
        default:
          break;
      }
    },
    onError: () => {
      Message.toast('添加失败！');
    },
  });

  const { loading: anomalyTemporaryLoading, run: anomalyTemporaryRun } = useRequest(anomalyTemporary, {
    manual: true,
    onSuccess: () => {
      onSuccess(skuItem);
      Message.toast('暂存成功！');
    },
    onError: () => {
      Message.toast('暂存失败！');
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(instockErrorEdit, {
    manual: true,
    onSuccess: () => {
      onClose();
      onEdit();
      Message.toast('修改成功！');
    },
    onError: () => {
      Message.toast('修改失败！');
    },
  });

  const { loading: deleteLoading, run: deleteRun } = useRequest(instockErrorDelete, {
    manual: true,
    onSuccess: () => {
      onClose(true);
      refreshOrder();
      Message.toast('删除成功！');
    },
    onError: () => {
      Message.toast('删除失败！');
    },
  });

  const { loading: detailyLoading, run: detailRun } = useRequest(instockErrorDetail, {
    manual: true,
    onSuccess: (res) => {
      let sku = {
        ...skuItem,
        number: res.needNumber,
        skuId: res.skuId,
        skuResult: res.skuSimpleResult,
        customerId: res.customerId,
        customerResult: res.customer,
        brandResult: res.brand,
        brandId: res.brandId,
      };

      let data = {
        anomalyId: res.anomalyId,
        number: res.realNumber,
      };

      let inkinds = ToolUtil.isArray(res.details).map((item) => {
        const imgs = item.reasonImg ? ToolUtil.isArray(JSON.parse(item.reasonImg)) : [];
        return {
          inkindId: item.inkindId,
          description: item.description,
          mediaIds: item.reasonImg,
          number: item.number,
          media: imgs.map((mediaId, index) => {
            return {
              url: ToolUtil.isArray(item.reasonUrls)[index],
              mediaId: mediaId,
              type: 'image',
            };
          }),
          noticeIds: ToolUtil.isArray(item.announcements).map((item) => {
            return item.noticeId;
          }),
        };
      });


      switch (type) {
        case ReceiptsEnums.instockOrder:
          sku = {
            ...sku,
            instockOrderId: res.formId,
            instockListId: '',
          };
          break;
        case ReceiptsEnums.stocktaking:
          break;
        default:
          break;
      }

      setSku(sku);

      setData(data);


      setInkinds(inkinds);

    },
    onError: () => {

    },
  });

  const skuResult = sku.skuResult || {};

  const spuResult = skuResult.spuResult || {};

  const batch = skuResult.batch === 1;

  const inkinsChange = (currentIndex, data) => {
    const newInkinds = inkinds.map((item, index) => {
      if (currentIndex === index) {
        return { ...item, ...data };
      }
      return item;
    });
    setInkinds(newInkinds);
  };

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
      onSuccess: (res) => {
        const inkind = res[0] || {};
        setInkinds([...inkinds, { inkindId: inkind.inkindId, number: 1, inkindType: inkind.source }]);
      },
    },
  );

  useEffect(() => {

    if (id) {
      detailRun({
        data: {
          anomalyId: id,
        },
      });
    }

    const errors = document.getElementById('errors');

    if (errors) {
      errors.addEventListener('scroll', (event) => {
        const scrollTop = event.target.scrollTop;
        if (scrollTop > 135) {
          setOver(true);
        } else {
          setOver(false);
        }
      });
    }

  }, []);

  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      const sku = backObject.inkindResult || backObject.result || {};
      if (['item', 'sku'].includes(backObject.type) && sku.skuId === skuItem.skuId) {
        if (ToolUtil.isObject(sku.inkindDetail).stockDetails) {
          return Message.toast('物料已入库！');
        } else {
          setData({ ...data, number: sku.number || 1 });
        }
      } else {
        return Message.toast('扫描物料不符！');
      }
    }
  }, [codeId]);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  const [over, setOver] = useState();

  let required = inkinds.filter((item) => {
    return ToolUtil.isArray(item.noticeIds).length === 0;
  }).length > 0;


  const getParams = () => {
    const detailParams = inkinds.map((item) => {
      return {
        pidInKind: item.inkindId,
        description: item.description,
        reasonImg: item.mediaIds,
        noticeIds: item.noticeIds,
        number: item.number,
      };
    });

    return {
      anomalyId: data.anomalyId,
      skuId: sku.skuId,
      brandId: sku.brandId,
      customerId: sku.customerId,
      needNumber: sku.number,
      realNumber: data.number,
      detailParams,
    };
  };

  const getStocktakingParams = () => {
    if (getParams()) {
      return {
        ...getParams(),
        inkind: sku.inkindId,
        positionId: sku.positionId,
        formId: sku.inventoryTaskId,
        anomalyType: 'StocktakingError',
      };
    }

  };

  const addShopCart = (
    imgUrl,
    imgId,
    transitionEnd = () => {
    }) => {

    const skuImg = document.getElementById(imgId);
    if (!skuImg) {
      return;
    }
    const top = skuImg.getBoundingClientRect().top;
    const left = skuImg.getBoundingClientRect().left;
    ToolUtil.createBall({
      top: top > 0 ? top : 0,
      left,
      imgUrl,
      transitionEnd,
      getNodePosition: () => {
        const waitInstock = document.getElementById('waitInstock');
        const parent = waitInstock.offsetParent;
        const translates = document.defaultView.getComputedStyle(parent, null).transform;
        let translateX = parseFloat(translates.substring(6).split(',')[4]);
        let tanslateY = parseFloat(translates.substring(6).split(',')[5]);
        return {
          top: parent.offsetTop + tanslateY + 65,
          left: parent.offsetLeft + translateX,
        };
      },
    });
  };

  const addShop = () => {
    const imgUrl = Array.isArray(skuItem.imgUrls) && skuItem.imgUrls[0] || state.homeLogo;
    addShopCart(imgUrl, 'errorSku', () => {
      refreshOrder();
      Message.toast('添加成功！');
    });

  };

  const errorTypeData = () => {

    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          title: '异常描述',
          skuItem: <SkuItem
            imgId='errorSku'
            skuResult={sku.skuResult}
            className={style.sku}
            extraWidth={(id && !noDelete) ? '84px' : '24px'}
            otherData={[
              ToolUtil.isObject(sku.customerResult).customerName,
              ToolUtil.isObject(sku.brandResult).brandName
            ]}
          />,
          actionNumber: <div className={style.actual}>
            <div className={style.number}>
              入库数量 {sku.number} {ToolUtil.isObject(spuResult.unitResult).unitName}
            </div>
            <div className={style.actual}>
              <span>实际到货</span>
              <MyStepper
                min={allNumber}
                value={data.number}
                onChange={(number) => {
                  setData({ ...data, number });
                }}
              />
              <Icon type='icon-dibudaohang-saoma' onClick={() => {
                props.dispatch({
                  type: 'qrCode/wxCpScan',
                  payload: {
                    action: 'position',
                  },
                });
              }} />
            </div>
          </div>,
          button: <div>
            <BottomButton
              disabled={required}
              only
              onClick={() => {
                if (!getParams()) {
                  return;
                }
                const instockParam = {
                  ...getParams(),
                  formId: sku.instockOrderId,
                  instockListId: sku.instockListId,
                  sourceId: sku.instockListId,
                  anomalyType: 'InstockError',
                };
                if (id) {
                  editRun({ data: instockParam });
                } else {
                  anomalyRun({ data: instockParam });
                }
              }}
            />
          </div>,
        };
      case ReceiptsEnums.stocktaking:
        return {
          title: '异常描述',
          skuItem: <SkuItem
            number={sku.stockNumber}
            skuResult={sku.skuResult}
            className={style.sku}
            extraWidth={id ? '84px' : '24px'}
            otherData={[ToolUtil.isObject(sku.brandResult).brandName]}
          />,
          actionNumber: <div className={style.actual}>
            <div className={style.number}>
              <div className={style.actual} style={{ padding: 0 }}>
                <span>实际库存</span>
                <MyStepper
                  min={allNumber}
                  style={{
                    '--button-text-color': '#000',
                  }}
                  value={data.number}
                  onChange={(number) => {
                    setData({ ...data, number });
                  }}
                />
              </div>
            </div>
            <div className={style.actual}>
              <Icon type='icon-dibudaohang-saoma' onClick={() => {
                props.dispatch({
                  type: 'qrCode/wxCpScan',
                  payload: {
                    action: 'position',
                  },
                });
              }} />
            </div>
          </div>,
          button: <BottomButton
            disabled={required}
            leftDisabled={id}
            leftText='暂存'
            rightText='确定'
            leftOnClick={() => {
              anomalyTemporaryRun({ data: getStocktakingParams() });
            }}
            rightOnClick={() => {
              if (id) {
                editRun({ data: getStocktakingParams() });
              } else {
                anomalyRun({ data: getStocktakingParams() });
              }
            }} />,
        };
      default:
        return {};
    }
  };

  return <div className={style.error} style={{ maxHeight }} id='errors'>

    <div className={style.header}>

      {
        over ?
          <div className={style.skuShow}>
            <img src={imgUrl || state.imgLogo} width={30} height={30} alt='' />
            <div>
              <div className={style.smallSku}  style={{ maxWidth: `calc(100vw - ${(id && !noDelete) ? 270 : 210}px)` }}>
                {SkuResultSkuJsons({ skuResult,spu:true })}
              </div>
              <div className={style.smallSku}  style={{ maxWidth: `calc(100vw - ${(id && !noDelete) ? 270 : 210}px)` }}>
              {SkuResultSkuJsons({ skuResult,sku:true })}
              </div>
            </div>
            <div className={style.number}>
              <ShopNumber min={allNumber} value={data.number} onChange={(number) => {
                setData({ ...data, number });
              }} />
            </div>
            {id && !noDelete && <LinkButton color='danger' onClick={() => {
              deleteRun({
                data: {
                  anomalyId: data.anomalyId,
                },
              });
            }}>
              删除异常
            </LinkButton>}
          </div>
          :
          <div className={style.title}>{errorTypeData().title}</div>
      }
      <span onClick={() => {
        onClose();
      }}><CloseOutline /></span>
    </div>


    <div style={{ padding: '0 12px' }} className={id ? style.skuItem : ''}>
      {errorTypeData().skuItem}
      {id && !noDelete && <LinkButton color='danger' onClick={() => {
        deleteRun({
          data: {
            anomalyId: data.anomalyId,
          },
        });
      }}>
        删除异常
      </LinkButton>}
    </div>

    {errorTypeData().actionNumber}


    <div className={style.space} />
    <Divider className={style.divider}>
      <Button style={{ width: 100 }} color='danger' fill='outline' onClick={() => {

        if (allNumber >= data.number) {
          return Message.toast('不能超过实际数量！');
        }

        CodeRun({
          data: {
            codeRequests: [{
              source: batch ? 'inErrorBatch' : 'inErrorSingle',
              brandId: sku.brandId,
              customerId: sku.customerId,
              id: sku.skuId,
              number: 1,
              inkindType: '入库异常',
            }],
          },
        });

      }}><AddOutline /></Button>
    </Divider>

    <div className={style.errors}>
      {
        inkinds.map((item, index) => {

          const inkindId = item.inkindId || '';

          return <div key={index} className={style.inkindItem}>
            <div className={style.inkindTitle}>
              <div className={style.inkind}>
                <div className={style.index}>{index + 1}</div>
                <span>识别码：{inkindId.substring(inkindId.length - 6, inkindId.length)}</span>
                <SystemQRcodeOutline />
              </div>

              <MyRemoveButton onRemove={() => {
                const newItem = inkinds.filter((item, currentIndex) => {
                  return currentIndex !== index;
                });
                setInkinds(newItem);
              }} />
            </div>
            <div className={style.stepper}>
              <span>数量</span>
              <MyStepper
                min={1}
                style={{
                  '--button-text-color': '#000',
                }}
                value={item.number}
                onChange={(number) => {
                  let allNumber = 0;
                  inkinds.map((item, currentIndex) => {
                    if (currentIndex !== index) {
                      allNumber += item.number;
                    }
                    return null;
                  });

                  if ((number + allNumber) > data.number) {
                    return Message.toast('不能超过实际数量！');
                  }
                  inkinsChange(index, { number });
                }}
              />
            </div>
            <div className={style.careful}>
              原因
              <Careful
                type='inStockError'
                value={item.noticeIds}
                onChange={(noticeIds) => {
                  inkinsChange(index, { noticeIds });
                }}
              />
            </div>
            <div className={style.imgs}>
              <UploadFile
                value={item.media}
                uploadId={`errorUpload${index}`}
                imgSize={36}
                icon={<CameraOutline />}
                noFile
                onChange={(mediaIds) => {
                  inkinsChange(index, { mediaIds });
                }}
              />
            </div>
            <Space direction='vertical' style={{ width: '100%' }}>
              描述
              <TextArea
                className={style.textArea}
                placeholder='请输入具体异常情况'
                value={item.description}
                onChange={(description) => {
                  inkinsChange(index, { description });
                }}
              />
            </Space>
          </div>;
        })
      }
    </div>

    {(
      CodeLoading
      ||
      anomalyLoading
      ||
      detailyLoading
      ||
      editLoading
      ||
      deleteLoading
      || anomalyTemporaryLoading
    ) &&
    <MyLoading />}


    {errorTypeData().button}

  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Error);
