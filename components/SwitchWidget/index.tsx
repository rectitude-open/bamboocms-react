import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { WidgetProps } from '@rjsf/utils';

const SwitchWidget = ({ value, options, onChange, label, required, rawErrors = [] }: WidgetProps) => {
  const { onValue = true, offValue = false } = options;

  const checked = value === onValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked ? onValue : offValue);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} color={rawErrors.length ? 'error' : 'primary'} />}
      label={
        <span>
          {label}
          {required && ' *'}
        </span>
      }
      labelPlacement='start'
      sx={{
        justifyContent: 'flex-end',
        marginLeft: 0,
      }}
    />
  );
};

export default SwitchWidget;
