const PageContainer = ({ children }) => {
  return (
    <div className="page-container">
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;