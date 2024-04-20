import { useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { useModal } from '../../context/ModalProvider';
import { useRouter } from 'next/navigation';

const useAddItemToCart = () => {
  const modal = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: addItemToCart } = useMutation(apis.Cart.addItmtoCart, {
    onSuccess: () => {
      modal?.confirm.addCart.handleConfirm(() => router.push('/cart'));
    },
    onSettled: () => {
      try {
        Promise.all([
          queryClient.invalidateQueries(['getUser']),
          queryClient.invalidateQueries(['getCartList'])
        ]);
      }
      catch (error) {
        console.log('error',error);
      }
    },
  });

  return {
    addItemToCart
  };
};

export default useAddItemToCart;