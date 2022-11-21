import React, { useEffect, useRef, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import { Button, TextArea } from 'antd-mobile';
import { AddOutline, CameraOutline } from 'antd-mobile-icons';
import { ScanIcon } from '../../../../../../../../components/Icon';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { useRequest } from '../../../../../../../../../util/Request';
import { useModel } from 'umi';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../components/Message';
import ShopNumber from '../../../../../../../../Work/AddShop/components/ShopNumber';
import { connect } from 'dva';
import { ReceiptsEnums } from '../../../../../../../index';
import BottomButton from '../../../../../../../../components/BottomButton';
import ErrorDom from './components/ErrorDom';
import Label from '../../../../../../../../components/Label';
import { MyDate } from '../../../../../../../../components/MyDate';
import { UserName } from '../../../../../../../../components/User';

const instockError = { url: '/anomaly/add', method: 'POST' };
const anomalyTemporary = { url: '/anomaly/temporary', method: 'POST' };
export const instockErrorDetail = { url: '/anomaly/detail', method: 'POST' };
const instockErrorEdit = { url: '/anomaly/edit', method: 'POST' };
const instockErrorDelete = { url: '/anomaly/delete', method: 'POST' };
export const getInkInd = { url: '/stockDetails/getInkind', method: 'POST' };

const Error = (
  {
    showError,
    errorShopRef,
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
    title,
    ...props
  },
) => {

  const [sku, setSku] = useState({});

  const show = sku.show || showError;

  useEffect(() => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        setSku({ ...skuItem, realNumber: skuItem.number, scanNumber: false });
        break;
      case ReceiptsEnums.stocktaking:
        setSku({ ...skuItem, realNumber: showStock ? skuItem.number : 0, scanNumber: false });
        break;
      default:
        break;
    }
  }, [skuItem.skuId]);

  const [inkinds, setInkinds] = useState([]);
  const [errorInkind, setErrorInkind] = useState(false);

  const inkindRef = useRef();

  const error = sku.realNumber !== sku.number || inkinds.length > 0;

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
          if (!showStock && inkinds.length === 0) {
            onSuccess({ ...sku, errorNumber: inkinds.length }, error ? -1 : 1, res.anomalyId);
            return;
          }
          break;
        default:
          break;
      }
      if (!error) {
        onSuccess({ ...sku, errorNumber: inkinds.length }, error ? -1 : 1, res.anomalyId);
        return;
      }
      addShop(() => {
        errorShopRef ? errorShopRef.current.jump(() => {
            onSuccess({ ...sku, errorNumber: inkinds.length }, error ? -1 : 1, res.anomalyId);
          }) :
          onSuccess({ ...sku, errorNumber: inkinds.length }, error ? -1 : 1, res.anomalyId);
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
        onSuccess({ ...sku, errorNumber: inkinds.length }, 2, res);
      });
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(instockErrorEdit, {
    manual: true,
    onSuccess: (res) => {
      Message.successToast('修改成功！', () => {
        onClose();
        onEdit({ ...sku, errorNumber: inkinds.length }, error ? -1 : 1, res.anomalyId);
      });
    },
  });

  const { loading: deleteLoading, run: deleteRun } = useRequest(instockErrorDelete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('删除成功！', () => {
        onClose(true);
        refreshOrder({ ...sku, errorNumber: inkinds.length }, 0);
      });
    },
  });
  const { loading: detailLoading, run: detailRun } = useRequest(instockErrorDetail, {
    manual: true,
    onSuccess: (res) => {
      const fileIds = res.enclosure ? res.enclosure.split(',') : [];
      const filedUrls = ToolUtil.isArray(res.filedUrls);
      let sku = {
        ...skuItem,
        createTime: res.createTime,
        user: res.user,
        scanNumber: false,
        number: res.needNumber,
        skuId: res.skuId,
        skuResult: res.skuResult,
        customerId: res.customerId,
        customerResult: res.customer,
        brandResult: res.brand,
        brandId: res.brandId,
        positionId: res.positionId,
        anomalyId: res.anomalyId,
        realNumber: res.realNumber,
        remark: res.remark,
        positionsResult: res.positionsResult,
        filedUrls: fileIds.map((item, index) => {
          return {
            mediaIds: item,
            url: filedUrls[index],
          };
        }),
      };

      let inkinds = ToolUtil.isArray(res.details).map((item) => {
        const imgs = item.reasonImg ? ToolUtil.isArray(JSON.parse(item.reasonImg)) : [];
        return {
          codeId: item.codeId,
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

      setInkinds(inkinds);

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
  const action = ToolUtil.isObject(props.qrCode).action;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      if (action === 'addError') {
        const inkind = backObject.inkindResult || backObject.result || {};
        if (['item', 'sku'].includes(backObject.type) && inkind.skuId === sku.skuId) {
          if (type === ReceiptsEnums.instockOrder && ToolUtil.isObject(inkind.inkindDetail).stockDetails) {
            return Message.toast('物料已入库！');
          } else {
            setSku({
              ...sku,
              realNumber: sku.scanNumber ? sku.realNumber + inkind.number : inkind.number,
              scanNumber: true,
            });
          }
        } else {
          return Message.toast('扫描物料不符！');
        }
      }
    }
  }, [codeId]);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  const [over, setOver] = useState(0);

  let required = inkinds.filter((item) => {
    return ToolUtil.isArray(item.noticeIds).length === 0;
  }).length > 0;


  const getParams = () => {
    const detailParams = inkinds.map((item) => {
      return {
        inkindId: item.inkindId,
        description: item.description,
        reasonImg: item.mediaIds,
        noticeIds: item.noticeIds,
        number: item.number,
      };
    });

    return {
      anomalyId: sku.anomalyId || null,
      skuId: sku.skuId,
      brandId: sku.brandId,
      customerId: sku.customerId,
      needNumber: sku.number,
      realNumber: sku.realNumber,
      remark: sku.remark,
      enclosure: sku.enclosure,
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
    const imgUrl =  ToolUtil.isArray(skuResult.imgResults)[0]?.thumbUrl || state.homeLogo;
    addShopCart(imgUrl, 'errorSku', transitionEnd);
  };

  if (detailLoading) {
    return <MyLoading skeleton />;
  }

  const errorTypeData = () => {

    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          title: '异常描述',
          shopId: 'instockError',
          addErrorHidden: show,
          errorNumberShow: show,
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
            <div className={style.actual} style={{ gap: 8 }}>
              <span>实到数量</span>
              <ShopNumber
                show={show}
                min={allNumber}
                value={sku.realNumber}
                onChange={(realNumber) => {
                  setInkinds([]);
                  setSku({ ...sku, realNumber, scanNumber: false });
                }}
              />
              <div hidden={show}>
                <ScanIcon onClick={() => {
                  props.dispatch({
                    type: 'qrCode/wxCpScan',
                    payload: {
                      action: 'addError',
                    },
                  });
                }} />
              </div>
            </div>
          </div>,
          button: <div style={{ minHeight: 60 }}>
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
          title: title || '盘点',
          shopId: 'stocktakingError',
          addErrorHidden: show || inkinds.length === 0,
          errorNumberShow: show || !batch,
          skuItem: <SkuItem
            imgId='errorSku'
            hiddenNumber={!showStock}
            number={sku.stockNumber}
            skuResult={sku.skuResult}
            className={style.sku}
            extraWidth={id ? '84px' : '24px'}
            otherData={[
              ToolUtil.isObject(sku.brandResult).brandName || '无品牌',
              ToolUtil.isObject(sku.positionsResult).name,
            ]}
          />,
          actionNumber: <div className={style.actual} style={{ alignItem: 'flex-start' }}>
            <div className={style.number}>
              <div hidden={!show} className={style.log}>
                <div className={style.user}><UserName user={sku.user} /></div>
                <div className={style.time}>{MyDate.Show(sku.createTime)}</div>
              </div>
              <div className={style.inKindRow}>
                <Label className={style.inKindTitle}>
                  盘点数量
                </Label>
                {show ? (sku.realNumber - sku.number) === 0 ? '无差异' : <>
                    盘{(sku.realNumber - sku.number) > 0 ? `盈` : `亏`}
                    <span className='numberBlue'>{Math.abs(sku.realNumber - sku.number) || 0}</span>
                    {ToolUtil.isObject(spuResult.unitResult).unitName}
                  </>
                  :
                  <ShopNumber
                    hiddenNumber={!showStock}
                    show={show}
                    min={allNumber}
                    value={sku.realNumber}
                    onChange={(realNumber) => {
                      setInkinds([]);
                      setSku({ ...sku, realNumber, scanNumber: false });
                    }}
                  />}
                <div hidden={show} style={{ flexGrow: 1, textAlign: 'right' }}>
                  <ScanIcon onClick={() => {
                    setErrorInkind(false);
                    inkindRef.current.open({
                      skuId: sku.skuId,
                      brandId: sku.brandId,
                      positionId: sku.positionId,
                      skuResult,
                    });
                  }} />
                </div>

              </div>
              <div className={style.inKindRow}>
                <Label className={style.inKindTitle}>
                  {show ? '照片' : '上传照片'}
                </Label>
                {show && ToolUtil.isArray(sku.filedUrls).length === 0 && '无'}
                <UploadFile
                  show={show}
                  files={ToolUtil.isArray(sku.filedUrls)}
                  uploadId={`errorUpload`}
                  imgSize={36}
                  noFile
                  onChange={(medias) => {
                    setSku({ ...sku, filedUrls: medias, enclosure: medias.map(item => item.mediaId).toString() });
                  }}
                />
              </div>
              <div className={style.inKindRow}>
                <Label className={style.inKindTitle}>
                  {show ? '备注' : '添加备注'}
                </Label>
                {show ? `${sku.remark || '无'}` : <TextArea
                  className={style.textArea}
                  rows={1}
                  placeholder='请输入具体异常情况'
                  value={sku.remark}
                  onChange={(remark) => {
                    setSku({ ...sku, remark });
                  }}
                />}
              </div>
              <div hidden={inkinds.length > 0 || show} className={style.inKindRow}>
                <Label className={style.inKindTitle}>
                  添加异常
                </Label>
                <Button
                  disabled={sku.realNumber <= 0}
                  className={style.addError}
                  color='danger'
                  onClick={() => {
                    setErrorInkind(true);
                    inkindRef.current.open({
                      skuId: sku.skuId,
                      brandId: sku.brandId,
                      positionId: sku.positionId,
                      skuResult,
                    });
                  }}
                >
                  <AddOutline />
                </Button>
              </div>
            </div>
          </div>,
          button: <div style={{ minHeight: 60 }}>
            <BottomButton
              rightDisabled={required}
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
              }} />
          </div>,
        };
      default:
        return {};
    }
  };

  return <div className={style.error} style={{ maxHeight, margin: show && 0 }} id='errors'>

    <ErrorDom
      showError={showError}
      over={over}
      imgUrl={imgUrl}
      state={state}
      id={id}
      noDelete={noDelete}
      skuResult={skuResult}
      allNumber={allNumber}
      sku={sku}
      setSku={setSku}
      deleteRun={deleteRun}
      errorTypeData={errorTypeData}
      onClose={onClose}
      show={show}
      inkinds={inkinds}
      setInkinds={setInkinds}
      inkinsChange={inkinsChange}
      type={type}
      batch={batch}
      errorInkind={errorInkind}
      setErrorInkind={setErrorInkind}
      inkindRef={inkindRef}
      showStock={showStock}
    />

    {(
      anomalyLoading
      ||
      editLoading
      ||
      deleteLoading
      ||
      anomalyTemporaryLoading
    ) &&
    <MyLoading />}

    {!show && errorTypeData().button}

  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Error);
