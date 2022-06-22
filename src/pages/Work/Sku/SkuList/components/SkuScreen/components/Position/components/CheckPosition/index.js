import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { CaretDownFilled, CaretRightFilled } from '@ant-design/icons';
import { Checkbox } from 'antd-mobile';
import Icon from '../../../../../../../../../components/Icon';

const CheckPosition = (
  {
    single,
    data = [],
    value = [],
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
              checked={value.map(item => item.id).includes(item.key)}
              icon={(checked) => {
                return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
              }}
              onChange={(checked) => {
                if (!checked) {
                  onChange(value.filter(position => position.id !== item.key));
                } else {
                  onChange(single ?
                    [{ id: item.key, name: item.title }]
                    :
                    [...value, {
                      id: item.key,
                      name: item.title,
                    }]);
                }
              }}
            />
          </div>
        </div>}
        {positions(childrens, left + 12)}
      </div>;
    });
  };

  const defaultOpen = (data, ids, openKeys = [], parentIds = []) => {

    data.map(item => {
      const childrens = item.children || item.loops || [];
      if (ids.includes(item.key)) {
        data.map(item => openKeys.push(item.key));
        parentIds.map(item => openKeys.push(item));
      } else {
        defaultOpen(childrens, ids, openKeys, [...parentIds, item.key]);
      }
      return null;
    });

    return openKeys;
  };

  useEffect(() => {
    const ids = value.map(item => item.id);
    const openKeys = [];
    data.map(item => {
      openKeys.push(item.key);
      const childrens = item.children || item.loops || [];
      return defaultOpen(childrens, ids).map((item) => {
        return openKeys.push(item);
      });
    });
    // console.log(defaultOpen(data, ids));
    setOpenKey(openKeys);
  }, [refresh]);

  return positions(data);
};

export default CheckPosition;