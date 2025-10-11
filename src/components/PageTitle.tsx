import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

interface BreadCrumbItemType {
  label: string;
  path?: string | null;
  active?: boolean;
}

interface PageTitleProps {
  title: string;
  breadCrumbItems: BreadCrumbItemType[];
  rightContent?: ReactNode;
  goBack?: () => void;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  breadCrumbItems,
  rightContent,
  goBack,
}) => {
  return (
    <div className="page__breadcrumb d-flex align-items-center justify-content-between">
      <div className="left d-flex align-items-center gap-2">
        {goBack && (
          <button
            type="button"
            className="btn btn-link p-0 me-2"
            onClick={goBack}
            title="Quay lại"
          >
            <i className="uil-arrow-left"></i>
          </button>
        )}

        <div>
          <h4 className="mb-0 mt-0 page__title">{title}</h4>
          <Breadcrumb className="font-size-14 d-none d-sm-block mb-0">
            <BreadcrumbItem>
              <Link to="/">
                <i className="uil-home-alt"></i>
              </Link>
            </BreadcrumbItem>
            {breadCrumbItems.map((item, index) =>
              item.active ? (
                <BreadcrumbItem active key={index}>
                  {item.label}
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem key={index}>
                  <Link to={item.path || "#"}>{item.label}</Link>
                </BreadcrumbItem>
              )
            )}
          </Breadcrumb>
        </div>
      </div>
      <div className="right__breadcrumb">{rightContent}</div>
    </div>
  );
};

export default PageTitle;
