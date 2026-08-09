import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { categorySchema, deletedResultSchema, envelopeSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, CategoryDto, CreateCategoryInput, DeletedResult } from "@/lib/api/types";

const categoryListEnvelope = envelopeSchema(z.array(categorySchema));
const categoryEnvelope = envelopeSchema(categorySchema);
const deletedEnvelope = envelopeSchema(deletedResultSchema);

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
      method: "PATCH",
      body: input,
    });
    return categoryEnvelope.parse(response).data;
  },

  async deleteCategory(id: string) {
    const response = await apiFetch<ApiEnvelope<DeletedResult>>(`/categories/${id}`, {
      method: "DELETE",
    });
    return deletedEnvelope.parse(response).data;
  }
};
