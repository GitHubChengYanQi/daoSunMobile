import React, { useEffect, useState } from 'react';
import style from '../index.less';
import MyKeybord from '../../../components/MyKeybord';
import { ScanIcon } from '../../../components/Icon';
import { connect } from 'dva';

const CodeNumber = (
  {
    onSuccess = () => {
    },
    codeNumber = 4,
    ...props
  },
) => {

  const [code, setCode] = useState([]);

  const initialCode = () => {
    const array = [];
    for (let i = 0; i < codeNumber; i++) {
      array.push({ key: i });
    }
    setCode(array);
  };

  const [visible, setVisible] = useState();

  const numbers = code.map(item => item.number).join('');

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
      <div className={style.title}>请输入领料码</div>
      <div className={style.inputNumber} onClick={() => {
        setVisible(true);
      }}>
        {
          code.map((item, index) => {
            return <div key={index} className={style.box}>
              {item.number}
            </div>;
          })
        }

      </div>
    </div>

    <MyKeybord
      noStepper
      popupClassName={style.popup}
      visible={visible}
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
      setVisible={setVisible}
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

    <div className={style.scan} onClick={() => {
      props.dispatch({
        type: 'qrCode/wxCpScan',
        payload: {
          action: 'getBackObject',
        },
      });
    }}>
      <ScanIcon />
    </div>
  </>;
};


export default connect(({ qrCode }) => ({ qrCode }))(CodeNumber);
