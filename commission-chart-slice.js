import { apiSlice } from "@/shared/store/api-slice";
import { endpoints } from "./endpoints";

const commissionChartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all categories
    getAllCategories: builder.query({
      query: () => ({
        url: endpoints.root, // /categories
      }),
    }),

    // Fetch parent categories
    getParentCategories: builder.query({
      query: () => ({
        url: `${endpoints.root}/${endpoints.getParentCategories}`, // /categories/parents
      }),
    }),

    // Fetch subcategories
    getSubCategories: builder.query({
      query: () => ({
        url: `${endpoints.root}/${endpoints.SubCategoryRoot}`, // /categories/subs
      }),
    }),

    // Add a new parent category
    addParentCategory: builder.mutation({
      query: (newCategory) => ({
        url: endpoints.addParentCategories, // /categories
        method: "POST",
        body: newCategory,
      }),
    }),

    // Add a new subcategory
    addSubCategory: builder.mutation({
      query: (newSubCategory) => ({
        url: `${endpoints.root}/${endpoints.addSubCategories}`, // /categories/sub
        method: "POST",
        body: newSubCategory,
      }),
    }),

    // Update a parent category
    updateParentCategory: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `${endpoints.updateParentCategories}/${id}`, // /categories/{id}
        method: "PUT",
        body: updateData,
      }),
    }),

    // Update a subcategory
    updateSubCategory: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `${endpoints.root}/${endpoints.updateSubCategories}/${id}`, // /categories/subs/{id}
        method: "PUT",
        body: updateData,
      }),
    }),

    // Delete a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${endpoints.root}/${endpoints.deleteCategories}/${id}`, // /categories/delete/{id}
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetParentCategoriesQuery,
  useGetSubCategoriesQuery,
  useAddParentCategoryMutation,
  useAddSubCategoryMutation,
  useUpdateParentCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteCategoryMutation,
} = commissionChartApi;

export default commissionChartApi;
