import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeOption } from '../../apis/cart/schema';
import apis from '../../apis';

/** 장바구니 아이템 옵션변경 */
const useChangeOption = () => {
  const queryClient = useQueryClient();

  const { mutate: changeOption } = useMutation((data: ChangeOption) => apis.Cart.changeOption(data),{
    onSettled: () => {
      queryClient.invalidateQueries(['getCartList']);
    }
  });

  return {
    changeOption
  };
};

export default useChangeOption;