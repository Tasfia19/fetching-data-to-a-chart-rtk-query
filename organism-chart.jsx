import ArrowDown from "@/assets/svg/arrow-down";
import CheckmarkSvg from "@/assets/svg/checkmark-svg";
import DeleteLineSvg from "@/assets/svg/delete-line-svg";
import EditNotePenSvg from "@/assets/svg/edit-note-pen-svg";
import TransformSvg from "@/assets/svg/transform-svg";
import { categoryNameDropdownOptions } from "@/features/commission-chart/data/category-list-data";
import InputLine from "@/shared/components/atoms/input-line/input-line";
import Table from "@/shared/components/atoms/table/table";
import TableCell from "@/shared/components/atoms/table/table-cell/table-cell";
import TableHeadCell from "@/shared/components/atoms/table/table-head-cell/table-head-cell";
import TableRow from "@/shared/components/atoms/table/table-row/table-row";
import DropdownCheckbox from "@/shared/components/molecules/dropdown-checkbox/dropdown-checkbox";
import { toaster } from "@/shared/components/molecules/react-hot-toast/react-hot-toast";
import InputWrapper from "@shared/components/atoms/input-wrapper/input-wrapper";
import TableBody from "@shared/components/atoms/table/table-body/table-body";
import TableHead from "@shared/components/atoms/table/table-head/table-head";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CategoryDeleteDropdown from "../../molecules/category-delete-dropdown/category-delete-dropdown";
import SubCategoryDropdown from "../../molecules/sub-category-dropdown/sub-category-dropdown";
import styleM from "./commission-chart-list.module.scss";
import { formatDateWithTime } from "@shared/utils/date-time";

export default function CommissionChartList({ headList, bodyList = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState("");
  const [modalType, setModalType] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [subCategoriesId, setSubCategoriesId] = useState([]);
  const [tableBodyList, setTableBodyList] = useState(bodyList);
  //console.log("data:",tableBodyList)
  // hook form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      cate_name: "",
      sub_cate_name: "",
      update_date: "",
      brand_commission: "",
      non_brand_commission: "",
    },
  });
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Dropdown Open
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleModalOpen = (id, type) => {
    setModalId(id);
    setModalOpen(!modalOpen);
    setModalType(type);

    if (type !== "cateTransformDropdown") {
      setIsEdit(false);
    }
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Edit Table
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleEdit = (
    id,
    cate_name,
    sub_cate_name,
    update_date,
    brand_commission,
    non_brand_commission
  ) => {
    setModalId(id);
    setIsEdit(true);

    setValue("cate_name", cate_name);
    setValue("sub_cate_name", sub_cate_name);
    setValue("update_date", update_date);
    setValue("brand_commission", brand_commission);
    setValue("non_brand_commission", non_brand_commission);
  };

  const onSubmitHandler = async (data) => {
    console.log("Data --> ", data); 
    toaster.success("Category Update Successfully");
    setIsEdit(false);
    reset();
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Main Category Delete
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleMainCategoryDelete = (id) => {
    toaster.success("Category Deleted Successfully");

    const updatedData = bodyList?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          deleteAction: item?.deleteAction?.map((item) => ({
            ...item,
            isChecked: false,
          })),
        };
      }
      return item;
    });
    setTableBodyList(updatedData);

    const updatedItems = subCategoriesId?.filter((item) => item.sId !== id);
    setSubCategoriesId(updatedItems);

    setModalOpen(false);
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Sub Category Delete Selected
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleSubCategoryDelete = (id) => {
    const isSelected = subCategoriesId?.some(({ sId }) => sId === id);
    const updatedItems = isSelected
      ? subCategoriesId?.filter((item) => item.sId !== id)
      : [...subCategoriesId, { sId: id }];
    setSubCategoriesId(updatedItems);
    setModalOpen(false);

    const updatedData = bodyList?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          deleteAction: item?.deleteAction?.map((item) => ({
            ...item,
            isChecked: false,
          })),
        };
      }
      return item;
    });
    setTableBodyList(updatedData);
  };
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Sub Category Dropdown Cancel Selected
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleSubCategoryDropdownCancel = () => {
    const isSelected = subCategoriesId?.some(({ sId }) => sId === modalId);
    if (isSelected) {
      const updatedItems = isSelected
        ? subCategoriesId?.filter((item) => item.sId !== modalId)
        : [...subCategoriesId, { sId: modalId }];
      setSubCategoriesId(updatedItems);
    }

    setModalOpen(false);
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Checkbox toggle
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  const handleCheckboxChange = (label, id) => {
    const updatedData = bodyList?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          deleteAction: item?.deleteAction?.map((item) => ({
            ...item,
            isChecked: item.label === label,
          })),
        };
      }
      return item;
    });
    setTableBodyList(updatedData);
  };

  // console.log("tableBodyList", tableBodyList)

  const handleDropdownSubmit = (data) => {
    toaster.success("Category name update successfully");
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Table className={styleM.CategoryListTable}>
        <TableHead>
          <TableRow>
            {headList.map(({ title }) => (
              <TableHeadCell key={title}>{title}</TableHeadCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {bodyList &&
            bodyList?.map(
              ({
                category_id,
                category_name,
                // sub_cate_name,
                updated_at,
                brand_commission,
                non_brand_commission,
                parent_category,
                deleteAction,
              }) => {
                return (
                  <TableRow
                    key={category_id}
                    className={
                      isEdit && modalId === category_id
                        ? styleM.TableBodyRowEdit
                        : ""
                    }
                  >
                    <TableCell dataCell="Category Name">
                      <div className={styleM.CategoryName}>
                        <Controller
                          name="category_name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <InputWrapper
                              size="sm"
                              err={errors.cate_name}
                              className={styleM.CategoryInputWrapper}
                            >
                              <InputLine
                                value={
                                  isEdit && modalId === id
                                    ? value
                                    : parent_category?.category_name
                                }
                                onChange={onChange}
                                className={`${styleM.CategoryInputLine} ${styleM.CategoryNameInputLine}`}
                              />
                            </InputWrapper>
                          )}
                        />

                        {isEdit && modalId === id ? (
                          <Controller
                            name="category_name"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field: { value, onChange } }) => (
                              <DropdownCheckbox
                                items={categoryNameDropdownOptions}
                                defaultTitle={<TransformSvg />}
                                handleSubmit={(item) => {
                                  onChange(item[0].sTitle);
                                  handleDropdownSubmit(item);
                                }}
                                isSearchBox={true}
                                isSingleSelect={true}
                                dropdownTitleClassName={
                                  styleM.CategoryNameTransformIcon
                                }
                                top="20px"
                                label="update"
                              />
                            )}
                          />
                        ) : (
                          <span
                            onClick={() => handleModalOpen(id, "cateDropdown")}
                            className={`${styleM.CategoryNameArrow} ${subCategoriesId?.some(({ sId }) => sId === category_id) ? styleM.CategoryNameArrowRed : ""}`}
                          >
                            <ArrowDown />
                          </span>
                        )}

                        {modalOpen &&
                          modalId === id &&
                          modalType === "cateDropdown" && (
                            <SubCategoryDropdown
                              setIsOpen={setModalOpen}
                              isDelete={subCategoriesId?.some(
                                ({ sId }) => sId === id
                              )}
                              handleSubCategoryDropdownCancel={
                                handleSubCategoryDropdownCancel
                              }
                            />
                          )}
                      </div>
                    </TableCell>
                    <TableCell dataCell="Sub Category">
                      <Controller
                        name="category_name"
                        control={control}
                        rules={{ required: "Sub Category is required" }}
                        render={({ field: { value, onChange } }) => (
                          <InputWrapper
                            size="sm"
                            err={errors.category_name}
                            className={styleM.CategoryInputWrapper}
                          >
                            <InputLine
                              placeHolder="Sub Category Name"
                              value={
                                isEdit && modalId === category_id
                                  ? value
                                  : category_name
                              }
                              onChange={onChange}
                              className={styleM.CategoryInputLine}
                              disabled={!isEdit && modalId !== category_id}
                            />
                          </InputWrapper>
                        )}
                      />
                    </TableCell>
                    <TableCell dataCell="Update Date">
                      <Controller
                        name="updated_at"
                        control={control}
                        rules={{ required: "Update date is required" }}
                        render={({ field: { value, onChange } }) => (
                          <InputWrapper
                            size="sm"
                            err={errors.updated_at}
                            className={styleM.CategoryInputWrapper}
                          >
                            <InputLine
                              placeHolder="Update date"
                              value={
                                isEdit && modalId === category_id
                                  ? formatDateWithTime(value)
                                  : formatDateWithTime(updated_at)
                              }
                              onChange={onChange}
                              className={styleM.CategoryInputLine}
                              disabled={!isEdit && modalId !== category_id}
                            />
                          </InputWrapper>
                        )}
                      />
                    </TableCell>
                    <TableCell dataCell="Brand_Commission">
                      {isEdit && modalId === id ? (
                        <Controller
                          name="brand_commission"
                          control={control}
                          rules={{
                            required: "Brand Commission is required",
                            validate: (value) => {
                              const numValue = Number(value);
                              return !isNaN(numValue) &&
                                numValue >= 0 &&
                                numValue <= 100
                                ? true
                                : "Invalid: Value must be a number between 0 and 100";
                            },
                          }}
                          render={({ field: { value, onChange } }) => (
                            <InputWrapper
                              size="sm"
                              err={errors.brand_commission}
                              className={styleM.CategoryInputWrapper}
                            >
                              <InputLine
                                placeHolder="Commission"
                                value={
                                  isEdit && modalId === id
                                    ? value
                                    : brand_commission
                                }
                                onChange={onChange}
                                className={styleM.CategoryInputLine}
                                disabled={!isEdit && modalId !== id}
                                type="number"
                              />
                            </InputWrapper>
                          )}
                        />
                      ) : (
                        <> {brand_commission}%</>
                      )}
                    </TableCell>
                    <TableCell dataCell="Non_Brand_Commission">
                      {isEdit && modalId === id ? (
                        <div className={styleM.CommissionCell}>
                          <span className={styleM.CommissionPercent}>
                            <Controller
                              name="non_brand_commission"
                              control={control}
                              rules={{
                                required: "Non Brand Commission is required",
                                validate: (value) => {
                                  const numValue = Number(value);
                                  return !isNaN(numValue) &&
                                    numValue >= 0 &&
                                    numValue <= 100
                                    ? true
                                    : "Invalid: Value must be a number between 0 and 100";
                                },
                              }}
                              render={({ field: { value, onChange } }) => (
                                <InputWrapper
                                  size="sm"
                                  err={errors.non_brand_commission}
                                  className={styleM.CategoryInputWrapper}
                                >
                                  <InputLine
                                    placeHolder="Commission"
                                    value={
                                      isEdit && modalId === category_id
                                        ? value
                                        : non_brand_commission
                                    }
                                    onChange={onChange}
                                    className={styleM.CategoryInputLine}
                                    disabled={
                                      !isEdit && modalId !== category_id
                                    }
                                    type="number"
                                  />
                                </InputWrapper>
                              )}
                            />
                          </span>
                          <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={styleM.CommissionCheckBtn}
                          >
                            <CheckmarkSvg />
                          </button>
                        </div>
                      ) : (
                        <> {non_brand_commission}%</>
                      )}
                    </TableCell>
                    <TableCell dataCell="Action">
                      <div className={styleM.CategoryActionCell}>
                        <span
                          onClick={() =>
                            handleEdit(
                              category_id,
                              category_name,
                              sub_cate_name,
                              updated_at,
                              brand_commission,
                              non_brand_commission
                            )
                          }
                        >
                          <EditNotePenSvg />
                        </span>
                        <span
                          onClick={() => handleModalOpen(id, "deleteDropdown")}
                        >
                          <DeleteLineSvg />
                        </span>
                        {modalOpen &&
                          modalId === id &&
                          modalType === "deleteDropdown" && (
                            <CategoryDeleteDropdown
                              id={id}
                              setIsOpen={setModalOpen}
                              handleMainCategoryDelete={
                                handleMainCategoryDelete
                              }
                              handleSubCategoryDelete={handleSubCategoryDelete}
                              deleteAction={deleteAction}
                              handleCheckboxChange={handleCheckboxChange}
                            />
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
        </TableBody>
      </Table>
    </form>
  );
}
