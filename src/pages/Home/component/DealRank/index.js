import React, { useEffect } from 'react';
import F2 from '@antv/f2';

const DealRank =() =>{
  function numberToMoney(n) {
    return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  useEffect(()=>{
    const data = [{
      brand: '05 霍建华',
      sales: 103902,
      const: 100
    }, {
      brand: '04 詹姆斯',
      sales: 112352,
      const: 100
    }, {
      brand: '03 李连杰',
      sales: 121823,
      const: 100
    }, {
      brand: '02 刘德华',
      sales: 154092,
      const: 100
    }, {
      brand: '01 周杰伦',
      sales: 182023,
      const: 100
    }];
    const chart = new F2.Chart({
      id: 'myChart1',
      pixelRatio: window.devicePixelRatio,
      padding: [20, 20, 5]
    });
    chart.source(data);
    chart.coord({
      transposed: true
    });
    chart.axis(false);
    chart.tooltip(false);
    chart.interval().position('brand*const').color('#d9e4eb').size(10).animate(false);
    chart.interval().position('brand*sales').size(10);

    // 绘制文本
    data.map((obj) => {
      chart.guide().text({
        position: [obj.brand, 'min'],
        content: obj.brand,
        style: {
          textAlign: 'start',
          textBaseline: 'bottom'
        },
        offsetY: -8
      });
      chart.guide().text({
        position: [obj.brand, 'max'],
        content: '$' + numberToMoney(obj.sales),
        style: {
          textAlign: 'end',
          textBaseline: 'bottom'
        },
        offsetY: -8
      });
      return null;
    });
    chart.render();
  },[]);
  return(
    <>
      <div>
        {/*<ListItem style={{padding: 10}} extra={<div style={{fontSize: 14}} onClick={()=>{router.push('/CompleteTrack');}}>详情 {<RightOutlined />}</div>} >成交排行</ListItem>*/}
        <canvas id="myChart1" style={{width: '100%', height: 260}} ></canvas>
      </div>
    </>
  );
};
export default DealRank;
