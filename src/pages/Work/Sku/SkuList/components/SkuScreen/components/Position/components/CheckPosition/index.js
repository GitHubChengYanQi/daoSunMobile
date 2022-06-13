import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { CaretDownFilled, CaretRightFilled } from '@ant-design/icons';
import { Checkbox } from 'antd-mobile';
import Icon from '../../../../../../../../../components/Icon';

const CheckPosition = (
  {
    data = [],
    value,
    onChange = () => {
    },
    refresh,
    checkShow = () => {
      return true;
    },
  },
) => {

  const [openKey, setOpenKey] = useState([]);

  const getChildrenKeys = (data, keys = []) => {
    if (!Array.isArray(data)) {
      return keys;
    }
    data.map((item) => {
      const childrens = item.children || item.loops;
      keys.push(item.key);
      return getChildrenKeys(childrens, keys);
    });

    return keys;

  };

  const openPositions = (open, children) => {
    let newOpenKey;
    if (open) {
      newOpenKey = openKey.filter(item => {
        return !getChildrenKeys(children).includes(item);
      });
    } else {
      newOpenKey = [...openKey, ...children.map(item => item.key)];
    }
    setOpenKey(newOpenKey);
  };


  const positions = (data, left = 0) => {

    if (!Array.isArray(data)) {
      return <></>;
    }

    return data.map((item, index) => {
      const childrens = item.children || item.loops || [];
      const open = childrens.filter(item => openKey.includes(item.key)).length === childrens.length;
      return <div key={index} className={style.positions}>
        {openKey.includes(item.key) && <div className={style.positionItem} style={{ paddingLeft: left }}>
          <div
            style={{ visibility: childrens.length === 0 && 'hidden' }}
            className={open ? style.open : ''}
            onClick={() => openPositions(open, childrens)}
          >
            {open ? <CaretDownFilled /> : <CaretRightFilled />}
          </div>
          <div className={style.name} onClick={() => openPositions(open, childrens)}>
            {item.title}
          </div>
          <div hidden={!checkShow(item)} className={style.checked}>
            <Checkbox
              checked={value === item.key}
              icon={(checked) => {
                return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
              }}
              onChange={(checked) => {
                if (!checked) {
                  onChange(null);
                } else {
                  onChange(item.key, item.title);
                }
              }}
            />
          </div>
        </div>}
        {positions(childrens, left + 12)}
      </div>;
    });
  };

  useEffect(() => {
    setOpenKey(data.map(item => item.key));
  }, [refresh]);

  return positions(data);
};

export default CheckPosition;
