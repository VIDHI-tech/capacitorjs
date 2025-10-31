import { useMutation } from "@tanstack/react-query";
import api from "@/api/queryClient";
import { endpoints } from "@/api/endpoints";

type MarkSeenResult = {
  pollId: string;
  status: "seen-set" | "already-seen" | "soft-error";
  message?: string;
};

export function useMarkSeen() {
  return useMutation({
    mutationFn: async (pollId: string): Promise<MarkSeenResult> => {
      const { data } = await api.post(endpoints.poll.pollMarkSeen, { pollId });
      // ApiResponse shape: { statusCode, data }
      return (data?.data ?? data) as MarkSeenResult;
    },
  });
}
