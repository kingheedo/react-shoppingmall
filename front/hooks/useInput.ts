import { useCallback, useState } from 'react';

interface IUseInputProps<T>{
  initialValue?: T,
  regex?: RegExp
}

export const useInput = <T>({ initialValue, regex }: IUseInputProps<T>) => {
  const [value, setValue] = useState(initialValue || '');
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (regex) {
      setValue(e.target.value.replace(regex, ''));
    } else {
      setValue(e.target.value);
    }
      
  },
  [],
  );

  return {
    value, 
    handler, 
    setValue
  };
};
