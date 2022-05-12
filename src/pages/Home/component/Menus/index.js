import React from 'react';
import Icon from '../../../components/Icon';
import { Space, Toast } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';
import { history } from 'umi';

const Menus = (
  {
    code,
    name,
    fontSize,
    onlyIcon,
    textOverflow,
    disabled,
  }) => {

  const MenusStyle = ({ icon, title, url }) => {
    if (onlyIcon) {
      return <Icon type={icon} style={{ fontSize }} />;
    }
    return <Space
      direction='vertical'
      align='center'
      style={{ width: '100%' }}
      onClick={() => {
        if (disabled) {
          return;
        }
        if (!url) {
          return Toast.show({ content: '暂未开通~', position: 'bottom' });
        }
        history.push(url);
      }}
    >
      <Icon type={icon} style={{ fontSize }} />
      <MyEllipsis width={textOverflow || '100%'} style={{ textAlign: 'center' }}>
        {title || name}
      </MyEllipsis>
    </Space>;
  };
  if (!code) {
    return MenusStyle({ icon: 'icon-gengduo', title: '更多', url: '/Home/MenusSetting' });
  }

  switch (code) {
    case 'purchase':
      return MenusStyle({ icon: 'icon-caigouguanli' });
    case 'SPU':
      return MenusStyle({ icon: 'icon-chanyanguanli' });
    case 'production':
      return MenusStyle({ icon: 'icon-caidan-shengchanguanli' });
    case 'ERP':
      return MenusStyle({ icon: 'icon-cangchuguanli' });
    case 'CRM':
      return MenusStyle({ icon: 'icon-crmguanli' });
    case 'process':
      return MenusStyle({ icon: 'icon-shenpi2' });
    case 'task':
      return MenusStyle({ icon: 'icon-renwu' });
    case 'message':
      return MenusStyle({ icon: 'icon-xiaoxi1' });
    case 'customer':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Customer' });
    case 'business':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Business' });
    case 'competitor':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Competitor' });
    case 'contract':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Contract' });
    case 'contacts':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Customer?contacts' });
    case 'outstockApply':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/OutstockApply' });
    case 'SalesOrder':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Order?type=2' });
    case 'stock':
      return MenusStyle({ icon: 'icon-kucunguanli1', url: '/Work/StoreHouse' });
    case 'instock':
      return MenusStyle({ icon: 'icon-rukuguanli2', url: '/Work/Instock/Orderlist' });
    case 'outstock':
      return MenusStyle({ icon: 'icon-chukuguanli2', url: '/Work/Production/PickLists?type=all' });
    case 'freeInstock':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Scan/InStock/FreeInstock' });
    case 'freeOutStock':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Scan/OutStock/FreeOutstock' });
    case 'inventory':
      return MenusStyle({ icon: 'icon-pandianguanli', url: '/Scan/Inventory' });
    case 'productionPlan':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Production' });
    case 'productionTask':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/ProductionTask' });
    case 'pickLists':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Production/PickLists' });
    case 'myCart':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/Production/MyCart' });
    case 'purchase_ask':
      return MenusStyle({ icon: 'icon-caigoushenqingguanli', url: '/Work/purchaseAsk' });
    case 'procurementOrder':
      return MenusStyle({ icon: 'icon-caigoudanguanli', url: '/Work/Order?type=1' });
    case 'Repair':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Repair' });
    case 'CreateRepair':
      return MenusStyle({ icon: 'icon-chuangjianbaoxiu2', url: '/CreateRepair' });
    case 'LogOut':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Login' });
    case 'action':
      return MenusStyle({ icon: 'icon-gengduo', url: '/Work/ProcessTask' });
    default:
      return MenusStyle({ icon: 'icon-gengduo' });
  }
};

export default Menus;
