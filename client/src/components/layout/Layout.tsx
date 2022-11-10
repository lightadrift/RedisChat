interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <main className=" min-h-[100vh] bg-[#121212] font-lato ">{children}</main>
    </>
  );
};

export default Layout;
