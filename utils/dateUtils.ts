import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatDate = (date: string, format: string = 'YYYY-MM-DD') => {
  return date ? dayjs.utc(date).local().format(format) : '';
};
