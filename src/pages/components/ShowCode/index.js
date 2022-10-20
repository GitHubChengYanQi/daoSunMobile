import React, { useEffect, useState } from 'react';
import { Dialog, Loading } from 'antd-mobile';
import jrQrcode from 'jr-qrcode';
import PrintCode from '../PrintCode';
import { ToolUtil } from '../ToolUtil';
import { QrCodeIcon } from '../Icon';
import { useRequest } from '../../../util/Request';
import style from './index.less';
import { MyLoading } from '../MyLoading';
import { connect } from 'dva';

const inkindDetail = { url: '/inkind/detail', method: 'POST' };
const skuDetail = { url: '/sku/printSkuTemplate', method: 'GET' };

const ShowCode = ({ code, id, children, type = 'inkind', size, source ,...props}) => {

  const [open, setOpen] = useState();

  const { loading, run } = useRequest(inkindDetail, {
    manual: true,
    onSuccess: (res) => {
      PrintCode.print([ToolUtil.isObject(res.printTemplateResult).templete], 0);
    },
  });

  const { loading: skuPrintLoading, run: skuPrint } = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      PrintCode.print([res], 0);
    },
  });

  const [codes, setCodes] = useState(code);

  const { loading: geCodeLoaidng, run: getCode } = useRequest(
    {
      url: '/orCode/backCode',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: (res) => {
        setCodes(res);
        setOpen(true);
      },
    });

  let title = '';
  switch (type) {
    case 'inkind':
      title = '实物';
      break;
    case 'sku':
      title = '物料';
      break;
    default:
      break;
  }

  const codePrint = () => {
    switch (type) {
      case 'inkind':
        run({ data: { inkindId: id } });
        break;
      case 'sku':
        skuPrint({ params: { skuId: id } });
        break;
      default:
        break;
    }
  };

  const click = () => {
    if (source && id) {
      getCode({
        data: {
          source,
          id,
        },
      });
    } else {
      setOpen(true);
    }
  };

  return <>
    {children ? <span onClick={click}>{children}</span> : <QrCodeIcon
      style={{ color: 'var(--adm-color-primary)', fontSize: size }}
      onClick={click}
    />}
    {geCodeLoaidng && <MyLoading />}
    <Dialog
      visible={open}
      className={style.codeDialog}
      content={<div style={{ textAlign: 'center' }}>
        <div className={style.codeTitle}>是否打印{title}码</div>
        <div style={{ paddingTop: 19 }}>
          <img src={jrQrcode.getQrBase64(codes)} alt='' width={187} />
        </div>
      </div>}
      actions={[[
        { text: '取消', key: 'close' },
        { text: (loading || skuPrintLoading) ? <Loading /> : '打印', key: 'print', disabled: ToolUtil.isQiyeWeixin() },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            setOpen('');
            return;
          case 'print':
            codePrint();
            return;
          default:
            return;
        }
      }}
    />
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(ShowCode);
