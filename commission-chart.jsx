import Button from "@/shared/components/atoms/button/button";
import SearchBar from "@/shared/components/molecules/search-bar/search-bar";
import PageHeaderLayout from "@/shared/components/organisms/page-header-layout/page-header-layout";
import Pagination from "@/shared/components/organisms/pagination/pagination";
import PageTemplate from "@/shared/components/templates/page-template/page-template";
import useClickOutside from "@/shared/hooks/use-click-outside";
import { useState } from "react";
import AddCategoryDropdown from "../../components/molecules/add-category-dropdown/add-category-dropdown";
import CommissionChartList from "../../components/organisms/commission-chart-list/commission-chart-list";
import { categoryTableHeadData,categoryTableBodyData } from "../../data/category-list-data"; 
import styleM from "./commission-chart.module.scss";
import { useGetAllCategoriesQuery, useGetSubCategoriesQuery } from "../../store/commission-chart-slice";

export default function CommissionChart() {
  const [modalOpen, setModalOpen] = useState(false);
  const domRef = useClickOutside(() => setModalOpen(false));

  // Fetch categories like this 
  const { data: responseData, isLoading, isError } = useGetSubCategoriesQuery();
//console.log("data:",responseData);
//console.log("Loading:",isLoading);
  // Handle data transformation
  const {data}=responseData || {} //data fetch
  

  return (
    <PageTemplate
      header={
        <PageHeaderLayout
          contentLeft={<SearchBar iconPosition="left" />}
          contentRight={
            <div className={styleM.CreateNewWrapper} ref={domRef}>
              <Button
                label="Create New"
                onClick={() => setModalOpen(!modalOpen)}
              />
              {modalOpen && <AddCategoryDropdown setOpen={setModalOpen} />}
            </div>
          }
        />
      }
      content={
        <CommissionChartList
          headList={categoryTableHeadData}
          bodyList={data} //pass query props
        />
      }
      footer={<Pagination />}
    />
  );
}
