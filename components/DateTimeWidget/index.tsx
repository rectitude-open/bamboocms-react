'use client';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { WidgetProps } from '@rjsf/utils';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

const DateTimeWidget = ({ value, onChange, required, schema }: WidgetProps) => {
  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue) {
      onChange(undefined);
      return;
    }
    const utcString = newValue.utc().format('YYYY-MM-DD HH:mm:ss');
    onChange(utcString);
  };

  const dateValue = useMemo(() => (value ? dayjs.utc(value).local() : dayjs().utc().local()), [value]);

  return (
    <DateTimePicker
      value={dateValue}
      onChange={handleChange}
      format='YYYY-MM-DD HH:mm:ss'
      views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
      ampm={false}
      timeSteps={{ minutes: 1, seconds: 1 }}
      slotProps={{
        textField: {
          variant: 'outlined',
          fullWidth: true,
          required,
          helperText: schema.description,
        },
        actionBar: {
          actions: ['today', 'clear', 'accept', 'cancel'],
        },
      }}
    />
  );
};

export default DateTimeWidget;
