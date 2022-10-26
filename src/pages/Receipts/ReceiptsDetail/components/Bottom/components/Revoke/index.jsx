import { ERPEnums } from '../../../../../../Work/Stock/ERPEnums';
import { isArray, isObject, ToolUtil } from '../../../../../../components/ToolUtil';
import { history } from 'umi';

export const InStockRevoke = (taskDetail) => {
  const order = taskDetail.receipts;
  const data = ToolUtil.isArray(taskDetail.receipts?.instockListResults);

  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.inStock,
      submitType: 'resubmit',
    },
    state: {
      theme: taskDetail.theme,
      skus: data.map(item => {
        return {
          brandId: item.brandId,
          brandName: isObject(item.brandResult).brandName,
          customerId: item.brandId,
          customerName: isObject(item.customerResult).customerName,
          number: item.number,
          skuId: item.skuId,
          skuResult: item.skuResult,
        };
      }),
      customerId: order.customerId,
      customerName: order.customerResult?.customerName,
      files: isArray(order.url).map((item, index) => ({
        mediaId: order.mediaIds[index],
        url: item,
      })),
      mediaIds: order.mediaIds,
      noticeIds: order.noticeIds,
      remark: order.remark,
    },
  });
};

export const OutStockRevoke = (taskDetail) => {
  const order = taskDetail.receipts;
  const data = ToolUtil.isArray(taskDetail.receipts?.detailResults);

  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.outStock,
    },
    state: {
      theme: taskDetail.theme,
      skus: data.map(item => {
        return {
          brandId: item.brandId,
          brandName: isObject(item.brandResult).brandName,
          customerId: item.brandId,
          customerName: isObject(item.customerResult).customerName,
          number: item.number,
          skuId: item.skuId,
          skuResult: item.skuResult,
        };
      }),
      files: isArray(order.enclosureUrl).map((item, index) => ({
        mediaId: order.enclosure[index],
        url: item,
      })),
      mediaIds: order.enclosure && order.enclosure.split(','),
      noticeIds: order.remarks && order.remarks.split(','),
      remark: order.note,
      userId: order.userId,
      userName: isObject(order.userResult).name,
      userAvatar: isObject(order.userResult).avatar,
    },
  });
};

export const AllocationRevoke = (taskDetail) => {
  const data = taskDetail.receipts;

  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.allocation,
      askType: data.type,
      allocationType: data.allocationType === 1 ? 'in' : 'out',
      storeHouseId: data.storehouseId,
      storeHouse: isObject(data.storehouseResult).name,
    },
    state: {
      files: isArray(data.enclosureUrl).map((item, index) => ({
        mediaId: data.enclosure && data.enclosure.split(',')[index],
        url: item,
      })),
      mediaIds: data.enclosure && data.enclosure.split(','),
      noticeIds: data.reason && data.reason.split(','),
      remark: data.remark,
    },
  });
};

export const StocktakingRevoke = (taskDetail) => {
  const receipts = taskDetail.receipts;

  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.stocktaking,
    },
    state: {
      skuList: isArray(receipts.taskList).map(item => {
        return {
          ...item,
          filterText: isArray(item.condition).join('/'),
          skuNum: item.realNumber,
          params: (item.classIds || item.brandIds || item.positionIds || item.spuId) ? {
            skuClasses: isArray(item.classIds).map(item => ({ label: '', value: item })),
            brands: isArray(item.brandIds).map(item => ({ label: '', value: item })),
            positions: isArray(item.positionIds).map(item => ({ name: '', id: item })),
            spuIds:item.spuId ? [item.spuId] : null,
            // boms: isArray(item.classIds).map(item => ({ title: '', key: item })),
          } : undefined,
        };
      }),
      beginTime: receipts.beginTime,
      endTime: receipts.endTime,
      method: receipts.method,
      files: isArray(receipts.mediaUrls).map((item, index) => ({
        mediaId: receipts.enclosure && JSON.parse(receipts.enclosure)[index],
        url: item,
      })),
      participants: isArray(receipts.participantList).map(item => ({
        id: item.userId,
        name: item.name,
        avatar: item.avatar,
      })),
      mediaIds: receipts.enclosure && JSON.parse(receipts.enclosure),
      noticeIds: receipts.notice && JSON.parse(receipts.notice),
      remark: receipts.remark,
      userId: receipts.userId,
      userName: isObject(receipts.user).name,
      avatar: isObject(receipts.user).avatar,
    },
  });
};

export const MaintenanceRevoke = (taskDetail) => {
  const receipts = taskDetail.receipts;

  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.curing,
    },
    state: {
      skuList: receipts.selectParamResults,
      startTime: receipts.startTime,
      endTime: receipts.endTime,
      nearMaintenance: receipts.nearMaintenance,
      files: isArray(receipts.enclosureUrl).map((item, index) => ({
        mediaId: receipts.enclosure && receipts.enclosure.split(',')[index],
        url: item,
      })),
      mediaIds: receipts.enclosure && receipts.enclosure.split(','),
      noticeIds: receipts.notice && receipts.notice.split(','),
      remark: receipts.note,
      userId: receipts.userId,
      userName: isObject(receipts.userResult).name,
      avatar: isObject(receipts.userResult).avatar,
    },
  });
};
