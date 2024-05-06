import React from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

const UploadGridItemLoader = (props: IContentLoaderProps) => (
  <ContentLoader
    speed={2}
    width={300}
    height={300}
    viewBox="0 0 300 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#e6e6e6"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="300" height="300" />
  </ContentLoader>
);

export default UploadGridItemLoader;
