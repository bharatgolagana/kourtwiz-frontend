import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface IDemoCollection {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/demo-collections`;

const fetchDemoCollections = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

const fetchDemoCollectionById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}//${id}`);
  return response.data;
};

const createDemoCollection = async (data: IDemoCollection) => {
  const response = await axios.post(API_BASE_URL, data);
  return response.data;
};

const updateDemoCollection = async ({
  id,
  data,
}: {
  id: string;
  data: IDemoCollection;
}) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

const deleteDemoCollection = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const useFetchDemoCollections = () =>
  useQuery({
    queryKey: ["demoCollections"],
    queryFn: fetchDemoCollections,
  });
  

export const useFetchDemoCollectionById = (id: string) =>
  useQuery({
    queryKey: ["demoCollection", id],
    queryFn: () => fetchDemoCollectionById(id),
    enabled: !!id,
  });

export const useCreateDemoCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IDemoCollection) => createDemoCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demoCollections"] });
    },
  });
};

export const useUpdateDemoCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IDemoCollection }) =>
      updateDemoCollection({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demoCollections"] });
    },
  });
};


export const useDeleteDemoCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDemoCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demoCollections"] });
    },
  });
};
