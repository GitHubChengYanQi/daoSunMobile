import { Dialog, Toast } from 'antd-mobile';
import { ToolUtil } from '../../../util/ToolUtil';

let pringCount = 0;
let canvas = [];

const print = (array, index) => {
  Toast.show({
    icon: 'loading',
    duration: 0,
    content: '打印中...',
  });
  pringCount = index;
  canvas = array.map((items) => {
    return `
      <!DOCTYPE html>
        <html>
          <head>
              <meta charset='utf-8' />
              <meta
                 name='viewport'
                 content='width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
              />
              <style>
              p {
              margin: 0;
              }
              h1,h2,h3,h4,h5,h6 {
               margin: 0;
              }
</style>
          </head>
          <body>
            <div style='max-width:384px;max-height: 240px;overflow-y: hidden'>${items}</div>
          </body>
        </html>
`;
  });
  if (/(Android)/i.test(navigator.userAgent)) {
    //判断Android
    window.Android && window.Android.nPrint(canvas[index]);
  } else { //pc
    const win = window.open();
    win.document.write(canvas[index]);
    setTimeout(() => {
      win.print();
      Toast.clear();
    }, 0);
  }

};

const nextPrint = () => {
  Dialog.alert({
    content: '打印纸不足，请放打印纸！',
    confirmText: '继续打印',
    onConfirm: () => {
      print(canvas, pringCount);
    },
  });
};

window.printOk = (status) => {
  if (status === 1) {
    pringCount++;
    if (pringCount < canvas.length) {
      window.Android && window.Android.nPrint(canvas[pringCount]);
    } else {
      Toast.clear();
    }
  } else {
    nextPrint();
    Toast.clear();
  }
};


export default {
  print,
  nextPrint,
};
