import style from '../../index.less';
import { SkuResultSkuJsons } from '../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import { AddOutline, CameraOutline, CloseOutline, SystemQRcodeOutline } from 'antd-mobile-icons';
import MyCard from '../../../../../../../../../../components/MyCard';
import { Picker, Space, TextArea } from 'antd-mobile';
import MyRemoveButton from '../../../../../../../../../../components/MyRemoveButton';
import { Message } from '../../../../../../../../../../components/Message';
import Careful
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/InstockSkus/components/Careful';
import UploadFile from '../../../../../../../../../../components/Upload/UploadFile';
import { AddButton } from '../../../../../../../../../../components/MyButton';
import { ReceiptsEnums } from '../../../../../../../../../index';
import ShowCode from '../../../../../../../../../../components/ShowCode';
import MyAntPopup from '../../../../../../../../../../components/MyAntPopup';
import CodeNumber from '../../../../../../../../../../Work/OutStockConfirm/CodeNumber';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import React, { useState } from 'react';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { batchBind } from '../../../../../../../../../../Scan/InStock/components/Url';
import { getInkInd } from '../../index';

export const stockInkinds = { url: '/anomalyBind/backStockInKind', method: 'POST' };
export const autoAddInkind = { url: '/anomalyBind/addInKindByAnomaly', method: 'POST' };

const ErrorDom = (
  {
    over,
    imgUrl,
    state,
    id,
    noDelete,
    skuResult,
    allNumber,
    sku,
    setSku,
    deleteRun,
    errorTypeData,
    onClose,
    show,
    inkinds,
    showCodeRef,
    setInkinds,
    inkinsChange,
    type,
    setGetInkind,
    batch,
    getInkind,
  }) => {

  const [selectInkind, setSelectInkind] = useState([]);

  const { loading: stockInkindsLoading, run: getStockInkinbs } = useRequest(stockInkinds, {
    manual: true,
    onSuccess: (res) => {
      const array = res || [];
      if (array.length === 0) {
        Message.toast('暂无库存！');
        return;
      }
      setSelectInkind(array.map(item => {
        return {
          label: item.orCodeId,
          value: item.formId,
          number: item.number,
        };
      }));
    },
  });

  const { loading: addInkindLoading, run: addInkindRun } = useRequest(autoAddInkind, {
    manual: true,
    onSuccess: (res) => {
      addInkind(res.formId, res.orCodeId, 1);
    },
  });

  const { loading: getInkindLoading, run: getInkindRun } = useRequest(getInkInd, {
    manual: true,
    onSuccess: (res) => {
      if (!res) {
        Message.errorToast('实物码不正确！');
        return;
      }
      addInkind(res.inkindId, res.qrCodeId, res.number);
    },
  });

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
      onSuccess: (res) => {
        const inkind = res[0] || {};
        addInkind(inkind.inkindId, inkind.codeId, 1);
      },
    },
  );

  const addInkind = (inkindId, codeId, number) => {
    if (!inkindId) {
      Message.errorToast('实物码不正确！');
      return;
    }
    const ids = inkinds.map(item => item.inkindId);
    if (ids.includes(inkindId)) {
      Message.errorToast('请勿重复添加实物！');
      return;
    }
    setInkinds([...inkinds, {
      codeId,
      inkindId,
      number,
    }]);
    setGetInkind(false);
  };

  return <>
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
              <ShopNumber min={allNumber} value={sku.realNumber} onChange={(realNumber) => {
                setSku({ ...sku, realNumber });
              }} />
            </div>
            {id && !noDelete && <LinkButton color='danger' onClick={() => {
              deleteRun({
                data: {
                  anomalyId: sku.anomalyId,
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
              anomalyId: sku.anomalyId,
            },
          });
        }}>
          删除异常
        </LinkButton>}
        {show && <LinkButton color='danger'>
          处理中
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
              {!show && <MyRemoveButton onRemove={() => {
                const newItem = inkinds.filter((item, currentIndex) => {
                  return currentIndex !== index;
                });
                setInkinds(newItem);
              }} />}
            </Space>}
          >
            <div className={style.inKindRow}>
              <div className={style.inKindTitle}>数量：</div>
              <ShopNumber
                show={errorTypeData().errorNumberShow}
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

                  if ((number + allNumber) > sku.realNumber) {
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
                show={show}
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
              {show ? `${item.description || '无'}` : <TextArea
                className={style.textArea}
                rows={1}
                placeholder='请输入具体异常情况'
                value={item.description}
                onChange={(description) => {
                  inkinsChange(index, { description });
                }}
              />}
            </div>
            <div className={style.imgs}>
              <UploadFile
                show={show}
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

      <div hidden={errorTypeData().addErrorHidden} className={style.divider}>
        <AddButton danger disabled={allNumber >= sku.realNumber} onClick={() => {
          switch (type) {
            case ReceiptsEnums.instockOrder:
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
              break;
            case ReceiptsEnums.stocktaking:
              setGetInkind(true);
              break;
            default:
              break;
          }
        }}><AddOutline /></AddButton>
      </div>
    </div>

    <ShowCode ref={showCodeRef} />

    <MyAntPopup
      title='获取实物'
      visible={getInkind}
      onClose={() => setGetInkind(false)} className={style.getInkind}
    >
      <CodeNumber
        inputSize={50}
        spaceSize={6}
        fontSize={16}
        title='请输入实物码后6位'
        codeNumber={6}
        other={<div className={style.otehrActions}>
          <LinkButton onClick={() => {
            getStockInkinbs({
              data: {
                skuId: sku.skuId,
                brandId: sku.brandId,
                customerId: sku.customerId,
                positionId: sku.positionId,
                // number:'1',
              },
            });
          }}>查询已有实物码</LinkButton>
          <LinkButton onClick={() => {
            addInkindRun({
              data: {
                skuId: sku.skuId,
                brandId: sku.brandId,
                customerId: sku.customerId,
                positionId: sku.positionId,
                number: 1,
              },
            });
          }}>生成新的实物码</LinkButton>
          {(stockInkindsLoading || addInkindLoading || getInkindLoading) && <MyLoading />}
        </div>}
        onSuccess={(code) => {
          getInkindRun({
            data: {
              storehousePositionsId: sku.positionId,
              skuId: sku.skuId,
              brandId: sku.brandId,
              inkind: code + '',
            },
          });
        }}
        onScanResult={(codeId, backObject = {}) => {
          if (backObject.type === 'item') {
            const inkind = backObject.inkindResult || {};
            const details = ToolUtil.isObject(inkind.inkindDetail).stockDetails || {};
            if (details.brandId === sku.brandId && details.skuId === sku.skuId && details.storehousePositionsId === sku.positionId) {
              addInkind(inkind.inkindId, codeId, details.number);
            } else {
              Message.errorToast('请扫描正确的实物码！');
            }
          } else {
            Message.errorToast('请扫描实物码！');
          }
        }}
      />
    </MyAntPopup>

    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[selectInkind]}
      visible={selectInkind.length > 0}
      onClose={() => {
        setSelectInkind([]);
      }}
      onConfirm={(value, options) => {
        const inkind = options.items[0] || {};
        addInkind(inkind.value, inkind.label, inkind.number || 1);
      }}
    />

    {(CodeLoading) && <MyLoading />}
  </>;
};

export default ErrorDom;
