import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { categorySchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, CategoryDto, CreateCategoryInput } from "@/lib/api/types";

const categoryListEnvelope = envelopeSchema(z.array(categorySchema));
const categoryEnvelope = envelopeSchema(categorySchema);

export const categoryService = {
  async listCategories() {
    const response = await apiFetch<ApiEnvelope<CategoryDto[]>>("/categories", {
      cache: "no-store",
    });
    return categoryListEnvelope.parse(response).data;
  },

  async createCategory(input: CreateCategoryInput) {
    const response = await apiFetch<ApiEnvelope<CategoryDto>>("/categories", {
      method: "POST",
      body: input,
    });
    return categoryEnvelope.parse(response).data;
  },

  async updateCategory(id: string, input: CreateCategoryInput) {
    const response = await apiFetch<ApiEnvelope<CategoryDto>>(`/categories/${id}`, {
      method: "PUT",
      body: input,
    });
    return categoryEnvelope.parse(response).data;
  },

  async deleteCategory(id: string) {
    const response = await apiFetch<ApiEnvelope<void>>(`/categories/${id}`, {
      method: "DELETE",
    });
    return response.data;
  }
};
