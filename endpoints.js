const rootApi = "/categories";

export const endpoints = {
  root: rootApi,
  getParentCategories: "parents",
  SubCategoryRoot: "subs",
  addParentCategories: `${rootApi}`,
  addSubCategories:"sub",
  updateParentCategories: `${rootApi}`,
  updateSubCategories: "subs",
  deleteCategories: "delete",
};
