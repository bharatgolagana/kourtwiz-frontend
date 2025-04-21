import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchClubMemberships = async (clubId: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { data } = await axios.get(
    `${BASE_URL}/api/membership-plans/${clubId}`,
    {
      headers: {
        Accept: '*/*',
      },
    }
  );
  return data;
};

export const useGetmembershipsByClubId = (clubId: string) => {
  return useQuery({
    queryKey: ['clubMemberships', clubId],
    queryFn: () => fetchClubMemberships(clubId),
    enabled: !!clubId, // Only fetch if clubId is available
  });
};
