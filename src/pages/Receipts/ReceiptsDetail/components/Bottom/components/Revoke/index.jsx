import { ERPEnums } from '../../../../../../Work/Stock/ERPEnums';
import { isArray, isObject } from '../../../../../../components/ToolUtil';
import { history } from 'umi';

export const InStockRevoke = ({order,data}) => {
  history.push({
    pathname: '/Work/CreateTask',
    query: {
      createType: ERPEnums.inStock,
      submitType: 'resubmit',
    },
    state: {
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
