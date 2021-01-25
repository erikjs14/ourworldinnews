import moment from 'moment';

export const getDateDiffInFormat = (diff: number, format: string): string => moment().subtract(diff, 'days').format(format);