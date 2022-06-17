import moment from 'moment';

const Show = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm');
};


export const MyDate = {
  Show,
};
