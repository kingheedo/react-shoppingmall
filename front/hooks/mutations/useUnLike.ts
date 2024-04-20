import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import apis from '../../apis';
import useGetUser from '../queries/useGetUser';

const useUnLike = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useGetUser();
  const { mutate: unLike } = useMutation((data: number) => apis.Product.unLike(data),
    {
      onMutate: async(variable) => {
        await queryClient.cancelQueries({ queryKey: ['getProducts'] });
        const previous = queryClient.getQueryData(['getProducts']);

        queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
          const newData = old?.pages.map((page:any) => 
            page.map((value:any) => {
              if (value.id === variable) {
                return {
                  ...value,
                  Likers: [...value.Likers.filter((liker: any) => liker.id !== user?.info.id)]
                };
              } else {
                return value;
              }
            })
          );

          return {
            ...old,
            pages: newData
          };
        });
        
        return { previous };
      },
    
      onError: (err, param, context) => {
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 401) {
            router.push('/signIn');
          } else {
            queryClient.setQueryData(['getProducts'], context?.previous);
          }
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      }
    });

  return {
    unLike
  };
};

export default useUnLike;