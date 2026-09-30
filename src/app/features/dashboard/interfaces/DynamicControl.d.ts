interface DynamicControl {
  id: string;
  key: string;
  type: ControlType;
  label: string;

  order: number;
  width?: number;

  required?: boolean;
  disabled?: boolean;

  placeholder?: string;

  defaultValue?: unknown;

  minLength?: number;
  maxLength?: number;

  min?: number;
  max?: number;

  pattern?: string;

  options?: DynamicOption[];
}
