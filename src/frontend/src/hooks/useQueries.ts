import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PortfolioItem, Testimonial } from "../backend";
import { backend } from "../backend-client";
import { useActor } from "./useActor";

export function usePortfolioItems() {
  const { actor, isFetching } = useActor();
  return useQuery<PortfolioItem[]>({
    queryKey: ["portfolioItems"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllPortfolioItems();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllTestimonials();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string | null;
      projectType: string;
      message: string;
    }) => {
      if (!actor) {
        // Fall back to direct backend call
        return await backend.submitContactForm(
          data.name,
          data.email,
          data.phone,
          data.projectType,
          data.message,
        );
      }
      return await actor.submitContactForm(
        data.name,
        data.email,
        data.phone,
        data.projectType,
        data.message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSubmissions"] });
    },
  });
}
