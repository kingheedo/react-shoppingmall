import { useCallback, useState } from 'react';

export default (initialValue) => {

    const [value, setValue] = useState(initialValue);
    const handler = useCallback(
    (e) => {
        !e.target.value 
        ?
        setValue(e.target.checked)
        :
        setValue(e.target.value)
        console.log(e.target.value)
        console.log(value)
    },
    [value],
)
return [value, handler, setValue]

}