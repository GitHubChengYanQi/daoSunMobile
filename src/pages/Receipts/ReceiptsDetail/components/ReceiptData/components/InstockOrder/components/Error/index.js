import React, { useEffect, useRef, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { Space, TextArea } from 'antd-mobile';
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
import MyCard from '../../../../../../../../components/MyCard';
import { AddButton } from '../../../../../../../../components/MyButton';
import ShowCode from '../../../../../../../../components/ShowCode';

const instockError = { url: '/anomaly/add', method: 'POST' };
const anomalyTemporary = { url: '/anomaly/temporary', method: 'POST' };
export const instockErrorDetail = { url: '/anomaly/detail', method: 'POST' };
const instockErrorEdit = { url: '/anomaly/edit', method: 'POST' };
const instockErrorDelete = { url: '/anomaly/delete', method: 'POST' };

const Error = (
  {
    anomalyType,
    id,
    noDelete,
    skuItem = {},
    onClose = () => {
    },
    onEdit = () => {
    },
    onHidden = () => {
    },
    onSuccess = () => {
    },
    refreshOrder = () => {
    },
    maxHeight = '80vh',
    type,
    showStock,
    ...props
  },
) => {

  console.log(skuItem);

  const [sku, setSku] = useState(skuItem);

  useEffect(() => {
    setSku(skuItem);
  }, [skuItem.skuId]);

  const [data, setData] = useState({ number: skuItem.number });

  const [inkinds, setInkinds] = useState([]);

  const error = data.number !== sku.number || inkinds.length > 0;

  let allNumber = 0;
  inkinds.map((item) => allNumber += item.number);

  const { loading: anomalyLoading, run: anomalyRun } = useRequest(instockError, {
    manual: true,
    onSuccess: (res) => {
      switch (type) {
        case ReceiptsEnums.instockOrder:
          onHidden();
          break;
        case ReceiptsEnums.stocktaking:
          onClose();
          break;
        default:
          break;
      }
      if (!error) {
        Message.successToast('添加成功！', () => {
          onSuccess(sku, error ? -1 : 1, res.anomalyId);
        });
        return;
      }
      addShop(() => {
        Message.successToast('添加成功！', () => {
          onSuccess(sku, error ? -1 : 1, res.anomalyId);
        });
      });
    },
    onError: () => {
      refreshOrder();
    },
  });

  const { loading: anomalyTemporaryLoading, run: anomalyTemporaryRun } = useRequest(anomalyTemporary, {
    manual: true,
    onSuccess: (res) => {
      Message.successToast('暂存成功！', () => {
        onSuccess(sku, 2, res);
      });
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(instockErrorEdit, {
    manual: true,
    onSuccess: (res) => {
      Message.successToast('修改成功！', () => {
        onClose();
        onEdit(sku, error ? -1 : 1, res.anomalyId);
      });
    },
  });

  const { loading: deleteLoading, run: deleteRun } = useRequest(instockErrorDelete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('删除成功！', () => {
        onClose(true);
        refreshOrder(sku, 0);
      });
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
        positionId: res.positionId,
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
  });

  const skuResult = sku.skuResult || {};

  const spuResult = skuResult.spuResult || {};

  const batch = skuResult.batch === 1;

  const showCodeRef = useRef();

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
        setInkinds([...inkinds, {
          codeId: inkind.codeId,
          inkindId: inkind.inkindId,
          number: 1,
          inkindType: inkind.source,
        }]);
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
          setOver(scrollTop);
        } else {
          setOver(0);
        }
      });
    }

  }, []);

  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      const inkind = backObject.inkindResult || backObject.result || {};
      if (['item', 'sku'].includes(backObject.type) && inkind.skuId === sku.skuId) {
        if (ToolUtil.isObject(inkind.inkindDetail).stockDetails) {
          return Message.toast('物料已入库！');
        } else {
          setData({ ...data, number: inkind.number || 1 });
        }
      } else {
        return Message.toast('扫描物料不符！');
      }
    }
  }, [codeId]);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  const [over, setOver] = useState(0);

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
        positionId: `${sku.positionId}`,
        formId: sku.inventoryTaskId,
        sourceId: sku.sourceId,
        // anomalyType: sku.inventoryTaskId ? '' : '',
        anomalyType,
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
      transitionEnd();
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
        const waitInstock = document.getElementById(errorTypeData().shopId);
        const parent = waitInstock.offsetParent;
        const translates = document.defaultView.getComputedStyle(parent, null).transform;
        let translateX = parseFloat(translates.substring(6).split(',')[4]);
        let tanslateY = parseFloat(translates.substring(6).split(',')[5]);
        return {
          top: parent.offsetTop + tanslateY + (errorTypeData().shopId === 'instockError' ? 65 : 0),
          left: parent.offsetLeft + translateX,
        };
      },
    });
  };

  const addShop = (
    transitionEnd = () => {
    },
  ) => {
    const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0] || state.homeLogo;
    addShopCart(imgUrl, 'errorSku', transitionEnd);
  };

  const errorTypeData = () => {

    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          title: '异常描述',
          shopId: 'instockError',
          skuItem: <SkuItem
            imgId='errorSku'
            skuResult={sku.skuResult}
            className={style.sku}
            extraWidth={(id && !noDelete) ? '84px' : '24px'}
            otherData={[
              ToolUtil.isObject(sku.customerResult).customerName,
              ToolUtil.isObject(sku.brandResult).brandName || '无品牌',
            ]}
          />,
          actionNumber: <div className={style.actual}>
            <div className={style.number}>
              <span>入库数量</span> {sku.number} {ToolUtil.isObject(spuResult.unitResult).unitName}
            </div>
            <div className={style.actual}>
              <span>实到数量</span>
              <ShopNumber
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
              square
              rightDisabled={required}
              leftOnClick={() => {
                onClose();
              }}
              rightOnClick={() => {
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
          shopId: 'stocktakingError',
          skuItem: <SkuItem
            imgId='errorSku'
            hiddenNumber={!showStock}
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
                <ShopNumber
                  min={allNumber}
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

    <div className={style.header} style={over ? { boxShadow: '0 1px 5px 0 rgb(0 0 0 / 30%)' } : {}}>

      {
        over ?
          <div className={style.skuShow}>
            <img src={imgUrl || state.imgLogo} width={30} height={30} alt='' />
            <div>
              <div className={style.smallSku} style={{ maxWidth: `calc(100vw - ${(id && !noDelete) ? 270 : 210}px)` }}>
                {SkuResultSkuJsons({ skuResult, spu: true })}
              </div>
              <div className={style.smallSku} style={{ maxWidth: `calc(100vw - ${(id && !noDelete) ? 270 : 210}px)` }}>
                {SkuResultSkuJsons({ skuResult, sku: true })}
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

    <MyCard noHeader className={style.cardStyle} bodyClassName={style.bodyStyle}>
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
    </MyCard>

    <div className={style.errors}>
      {
        inkinds.map((item, index) => {

          const inkindId = item.inkindId || '';

          return <MyCard
            key={index}
            className={style.inKindCard}
            headerClassName={style.headerStyle}
            titleBom={<div className={style.inkind}>
              异常编码
              <div className={style.index}>{index + 1}</div>
              <span>{inkindId.substring(inkindId.length - 6, inkindId.length)}</span>
            </div>}
            extra={<Space>
              <LinkButton onClick={() => showCodeRef.current.openCode(item.codeId)}><SystemQRcodeOutline /></LinkButton>
              <MyRemoveButton onRemove={() => {
                const newItem = inkinds.filter((item, currentIndex) => {
                  return currentIndex !== index;
                });
                setInkinds(newItem);
              }} />
            </Space>}
          >
            <div className={style.inKindRow}>
              <div className={style.inKindTitle}>数量：</div>
              <ShopNumber
                min={1}
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
            <div className={style.inKindRow}>
              <div className={style.inKindTitle}>
                原因 <span>*</span>：
              </div>
              <Careful
                type='inStockError'
                value={item.noticeIds}
                onChange={(noticeIds) => {
                  inkinsChange(index, { noticeIds });
                }}
              />
            </div>
            <div className={style.inKindRow}>
              <div className={style.inKindTitle}>
                描述：
              </div>
              <TextArea
                className={style.textArea}
                rows={1}
                placeholder='请输入具体异常情况'
                value={item.description}
                onChange={(description) => {
                  inkinsChange(index, { description });
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
          </MyCard>;
        })
      }

      <div className={style.divider}>
        <AddButton danger disabled={allNumber >= data.number} onClick={() => {

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

        }}><AddOutline /></AddButton>
      </div>
    </div>

    <ShowCode ref={showCodeRef} />

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
