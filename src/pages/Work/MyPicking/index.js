import React from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import { useModel } from 'umi';
import { Image } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

const MyPicking = () => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const storeHouse = ['仓库1', '仓库2'];

  const history = useHistory();

  return <div className={style.myPicking}>
    <MyNavBar title='领料中心' />

    {
      storeHouse.map((item, index) => {
        return <div key={index} className={style.storeHouseItem} onClick={() => {
          history.push(`/Work/MyPicking/Sku?storeHouseId=${item}`);
        }}>
          <div className={style.storeHouseData}>
            <div className={style.img}><Image src={state.imgLogo} width={96} height={96} /></div>
            <div className={style.data}>
              <div className={style.name}>
                {item}
              </div>
              <div className={style.address}>
                地址：12312312321
              </div>
              <div className={style.pickData}>
                可领物料 <span>38</span>类 <span>124</span>件
              </div>
            </div>
          </div>

          <div className={style.skuClassData}>
            {
              ['产成品', '外购件'].map((classItem, classindex) => {
                return <div key={classindex} className={style.classItem}>
                  {classItem} <span>12</span>类 <span>12</span>件
                </div>;
              })
            }
          </div>
        </div>;
      })
    }
  </div>;

};

export default MyPicking;
