
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative">
      {children}
    </div>
  );
};

export default Layout;
