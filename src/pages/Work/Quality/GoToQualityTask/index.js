import { useRequest } from '../../../../util/Request';
import { Dialog } from 'antd-mobile';
import { history } from 'umi';
import React, { useImperativeHandle } from 'react';
import { MyLoading } from '../../../components/MyLoading';


const GoToQualityTask = ({ codeIds, source, type }, ref) => {

  const { loading: backObjectLoading, run: backObjectRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
  });

  const error = () => {
    Dialog.alert({
      content: '请扫当前任务的实物码！',
    });
  };

  const inkindType = (codeId, data) => {
    if (!source || data.source === source) {
      switch (data.source) {
        case '质检':
          if (!codeIds || codeIds.includes(codeId)) {
            history.push({
              pathname: '/Work/Quality/QualityTask',
              state: {
                items: {
                  ...data.taskDetail,
                  skuResult: data.skuResult,
                  brand: data.brand,
                  customer: data,
                },
                codeId,
              },
            });
          } else {
            error();
          }
          break;
        default:
          break;
      }
    } else {
      error();
    }
  };

  const codeType = (codeId, res) => {
    if (!type || res.type === type) {
      switch (res.type) {
        case 'item':
          inkindType(codeId, res.inkindResult);
          break;
        case 'instock':
        case 'outstock':
        case 'storehousePositions':
        case 'spu':
        case 'storehouse':
        case 'stock':
          history.push(`/OrCode?id=${codeId}`);
          break;
        default:
          break;
      }
    } else {
      error();
    }

  };

  const goToQualityTask = async (codeId) => {
    if (codeId) {
      const res = await backObjectRun({
        params: {
          id: codeId,
        },
      });
      codeType(codeId, res);
    }
  };

  useImperativeHandle(ref, () => ({
    goToQualityTask,
  }));

  return backObjectLoading && <MyLoading />;

};

export default React.forwardRef(GoToQualityTask);
