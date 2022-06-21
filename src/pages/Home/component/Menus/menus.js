import { ReceiptsEnums } from '../../../Receipts';

export const menus = [
  { code: 'purchase', icon: 'icon-caigouguanli', url: '' },
  { code: 'purchase', icon: 'icon-caigouguanli' },
  { code: 'SPU', icon: 'icon-chanyanguanli' },
  { code: 'production', icon: 'icon-caidan-shengchanguanli' },
  { code: 'ERP', icon: 'icon-cangchuguanli',url:'/Work/Stock' },
  { code: 'CRM', icon: 'icon-crmguanli' },
  { code: 'process', icon: 'icon-liuchengguanli' },
  { code: 'task', icon: 'icon-renwu' },
  { code: 'message', icon: 'icon-xiaoxi1' },
  { code: 'customer', icon: 'icon-kehuguanli', url: '/Work/Customer' },
  { code: 'business', icon: 'icon-xiangmuguanli', url: '/Work/Business' },
  { code: 'competitor', icon: 'icon-jingzhengduishou2', url: '/Work/Competitor' },
  { code: 'contract', icon: 'icon-hetongguanli', url: '/Work/Contract' },
  { code: 'contacts', icon: 'icon-lianxiren2', url: '/Work/Customer?contacts' },
  { code: 'outstockApply', icon: 'icon-fahuoshenqing1', url: '/Work/OutstockApply' },
  { code: 'SalesOrder', icon: 'icon-xiaoshoudingdan', url: '/Work/Order?type=2' },
  { code: 'stock', icon: 'icon-kucunguanli1', url: '/Work/Stock' },
  { code: 'storeHouse', icon: 'icon-gengduo', url: '/Work/StoreHouse' },
  { code: 'instock', icon: 'icon-rukuguanli2', url: '/Work/Instock/Orderlist' },
  { code: 'outstock', icon: 'icon-chukuguanli2', url: '/Work/Production/PickLists?type=all' },
  { code: 'freeInstock', icon: 'icon-gengduo', url: '/Scan/InStock/FreeInstock' },
  { code: 'freeOutStock', icon: 'icon-gengduo', url: '/Scan/OutStock/FreeOutstock' },
  { code: 'inventory', icon: 'icon-pandianguanli', url: '/Scan/Inventory' },
  { code: 'productionPlan', icon: 'icon-shengchanjihua', url: '/Work/Production' },
  { code: 'productionTask', icon: 'icon-gengduo', url: '/Work/ProductionTask' },
  { code: 'pickLists', icon: 'icon-gengduo', url: '/Work/Production/PickLists' },
  { code: 'myCart', icon: 'icon-wodelingliao', url: '/Work/MyPicking' },
  { code: 'purchase_ask', icon: 'icon-caigoushenqingguanli', url: '/Work/purchaseAsk' },
  { code: 'procurementOrder', icon: 'icon-caigoudanguanli', url: '/Work/Order?type=1' },
  { code: 'Repair', icon: 'icon-gongdanguanli2', url: '/Repair' },
  { code: 'CreateRepair', icon: 'icon-chuangjianbaoxiu2', url: '/CreateRepair' },
  { code: 'LogOut', icon: 'icon-tuichudenglu', url: '/Login' },
  { code: 'action', icon: 'icon-shenpiguanli', url: '/Work/ProcessTask' },
  { code: 'EXCEL_PROCESS', icon: 'icon-excelbiao' },
  { code: 'data_source', icon: 'icon-shujurongqi' },
  { code: 'demos_show', icon: 'icon-gaojizujian' },
  { code: 'wxuserInfo', icon: 'icon-weixinbangding' },
  { code: 'dashboard', icon: 'icon-zhukongmianban' },
  { code: 'console2', icon: 'icon-tongjibaobiao' },
  { code: 'system', icon: 'icon-xitongguanli1' },
  { code: 'dev_tools', icon: 'icon-kaifaguanli' },
  { code: 'dasc', icon: 'icon-wofaqide' },
  { code: 'MySend', icon: 'icon-wodechaosong' },
  { code: 'audit', icon: 'icon-woshenhede' },
  { code: 'MyAudit', icon: 'icon-weishenhede' },
  { code: 'banner', icon: 'icon-lunbotuguanli' },
  { code: 'navigation', icon: 'icon-daohangguanli' },
  { code: 'goods', icon: 'icon-tuijianshangpin' },
  { code: 'repair', icon: 'icon-shouhouguanli' },
  { code: 'speechcraft', icon: 'icon-huashuguanli' },
  { code: 'businessTrack', icon: 'icon-genjinguanli' },
  { code: 'data', icon: 'icon-xinxiguanli' },
  { code: 'competitorQuote', icon: 'icon-baojiaguanli2' },
  { code: 'daoxinPortalClass', icon: 'icon-fenleiliebiao' },
  { code: 'tool', icon: 'icon-gongjuguanli' },
  { code: 'qrCode', icon: 'icon-erweimaguanli' },
  { code: 'qualityCheck', icon: 'icon-zhijianguanli' },
  { code: 'SPUS', icon: 'icon-chanpinguanli' },
  { code: 'sop', icon: 'icon-zuoyezhidao' },
  { code: 'parts', icon: 'icon-wuliaoqingdan' },
  { code: 'sku', icon: 'icon-jichuwuliao' },
  { code: 'createUser', icon: 'icon-kehuliebiao2' },
  { code: 'instockAsk', icon: 'icon-gengduo', url: `/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}` },
  { code: 'outstockAsk', icon: 'icon-gengduo', url: `/Receipts/ReceiptsCreate?type=${ReceiptsEnums.outstockOrder}` },
  { code: 'error', icon: 'icon-gengduo', url: '/Work/Error' },
];
