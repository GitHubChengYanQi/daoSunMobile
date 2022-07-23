import React, { useEffect, useState } from 'react';
import style from '../index.less';
import MyKeybord from '../../../components/MyKeybord';
import { ScanIcon } from '../../../components/Icon';
import { connect } from 'dva';
import { ToolUtil } from '../../../components/ToolUtil';
import { Divider } from 'antd-mobile';

const CodeNumber = (
  {
    open,
    onSuccess = () => {
    },
    codeNumber = 4,
    onScanResult = () => {

    },
    title,
    inputSize = 60,
    fontSize = 20,
    spaceSize = 11,
    other,
    ...props
  },
) => {

  const [code, setCode] = useState([]);

  const [visible, setVisible] = useState();

  const initialCode = () => {
    const array = [];
    for (let i = 0; i < codeNumber; i++) {
      array.push({ key: i });
    }
    setCode(array);
  };

  const numbers = code.map(item => item.number).join('');

  const qrCode = ToolUtil.isObject(props.qrCode);

  const codeId = qrCode.codeId;
  const action = qrCode.action;
  const backObject = qrCode.backObject || {};

  useEffect(() => {
    if (codeId && action === 'getBackObject') {
      props.dispatch({ type: 'qrCode/clearCode' });
      onScanResult(codeId, backObject);
    }
  }, [codeId]);

  useEffect(() => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload: {
        action: 'getBackObject',
      },
    });
    initialCode();
  }, []);

  return <>
    <div className={style.codeInput}>
      <div className={style.title}>{title}</div>
      <div className={style.inputNumber}>
        {
          code.map((item, index) => {
            return <div key={index} className={style.codeItem} onClick={() => {
              setVisible(true);
            }}>
              <div
                className={style.box}
                style={{
                  width: inputSize,
                  height: inputSize,
                  lineHeight: `${inputSize}px`,
                  fontSize: fontSize,
                }}
              >
                {item.number}
              </div>
              <div hidden={code.length === index + 1} className={style.space}
                   style={{ margin: spaceSize, width: spaceSize }} />
            </div>;
          })
        }
      </div>
      <Divider className={style.divider}>或</Divider>
      <div className={style.scan}>
        <div className={style.scanStyle} onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'getBackObject',
            },
          });
        }}>
          <ScanIcon />
        </div>
      </div>
      <div>{other}</div>
    </div>

    <MyKeybord
      noStepper
      popupClassName={open ? style.openPopup : style.popup}
      visible={open || visible}
      setVisible={setVisible}
      numberClick={(number) => {
        let ok = 0;
        const newCode = code.map((item, index) => {
          if (!item.number && !ok && item.number !== 0) {
            ok = index + 1;
            return { ...item, number };
          }
          return item;
        });
        if (ok === code.length) {
          onSuccess(newCode.map(item => item.number).join(''));
        }
        setCode(newCode);
      }}
      onConfirm={() => {
        onSuccess(code.map(item => item.number).join(''));
      }}
      onBack={() => {
        const newCode = code.map((item, index) => {
          if (index === numbers.length - 1) {
            return { key: item.key };
          }
          return item;
        });
        setCode(newCode);
      }}
    />
  </>;
};


export default connect(({ qrCode }) => ({ qrCode }))(CodeNumber);
