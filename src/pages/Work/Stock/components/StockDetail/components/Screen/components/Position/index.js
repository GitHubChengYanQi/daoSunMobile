import React, { useEffect, useState } from 'react';
import { Card, Checkbox } from 'antd-mobile';
import { CaretRightFilled, CaretDownFilled } from '@ant-design/icons';
import style from './index.less';
import Icon from '../../../../../../../../components/Icon';

const Position = (
  {
    options,
    title,
    value,
    onChange = () => {
    },
    refresh,
  }) => {

  const [openKey, setOpenKey] = useState([]);

  useEffect(() => {
    if (refresh && !value) {
      setOpenKey(options.map(item => item.key));
    }
  }, [refresh]);

  if (options.length === 0 && !value) {
    return <></>;
  }

  const getChildrenKeys = (data, keys = []) => {
    if (!Array.isArray(data)) {
      return keys;
    }

    data.map((item) => {
      keys.push(item.key);
      return getChildrenKeys(item.loops, keys);
    });

    return keys;

  };

  const openPositions = (open, loops) => {
    let newOpenKey;
    if (open) {
      newOpenKey = openKey.filter(item => {
        return !getChildrenKeys(loops).includes(item);
      });
    } else {
      newOpenKey = [...openKey, ...loops.map(item => item.key)];
    }
    setOpenKey(newOpenKey);
  };

  const positions = (data, left = 0) => {

    if (!Array.isArray(data)) {
      return <></>;
    }

    return data.map((item, index) => {
      const loops = item.loops || [];
      const open = loops.filter(item => openKey.includes(item.key)).length === loops.length;
      return <div key={index} className={style.positions}>
        <div hidden={!openKey.includes(item.key)} className={style.positionItem} style={{ paddingLeft: left }}>
          <div
            style={{ visibility: loops.length === 0 && 'hidden' }}
            className={open ? style.open : ''}
            onClick={() => openPositions(open, loops)}
          >
            {open ? <CaretDownFilled /> : <CaretRightFilled />}
          </div>
          <div className={style.name} onClick={() => openPositions(open, loops)}>
            {item.title}
          </div>
          <div className={style.checked}>
            <Checkbox
              checked={value === item.key}
              icon={(checked) => {
                return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
              }}
              onChange={(checked) => {
                if (!checked) {
                  onChange(null);
                } else {
                  onChange(item.key);
                }
              }}
            />
          </div>
        </div>
        {positions(item.loops, left + 12)}
      </div>;
    });

  };

  return <div>
    <Card
      title={title}
      headerStyle={{ border: 'none' }}
    >
      {positions(options)}
    </Card>

  </div>;
};

export default Position;
