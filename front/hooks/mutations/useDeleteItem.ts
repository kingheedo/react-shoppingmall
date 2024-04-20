import { useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';

/** 장바구니 아이템 삭제 */
const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteItem } = useMutation((ids: number[]) => apis.Cart.deleteItem(ids), {
    onSettled: () => {
      queryClient.invalidateQueries(['getCartList']);
    },
  });

  return {
    deleteItem
  };
};

export default useDeleteItem;