import { RegGetAllOutputDto } from "@/Dtos/RegGetAllDto";
import { api } from "@/Services/Api";
import { useQuery } from "@tanstack/react-query";

export function useGetSeparacao(enabled: boolean) {
  const query = useQuery<RegGetAllOutputDto[]>({
    queryKey: ["regAll"],
    queryFn: async () => {
      const response = await api.get<RegGetAllOutputDto[]>(`Reg/GetAll`);
      return response.data;
    },
    // staleTime: 3000, // 3 segundos
    refetchInterval: 5000, // 5 seconds
    enabled: enabled,
    retry: false,
  });

  // if (query.error) {
  //   const error = query.error as any;
  //   const statusCode = error?.response?.status;

  //   if (statusCode === 404) {
  //     toast.error("Pedido não encontrado!");
  //   } else {
  //     toast.error("Erro desconhecido, contate o suporte!");
  //   }
  // }

  return query;
}
