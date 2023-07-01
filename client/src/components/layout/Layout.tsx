interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {

  return (
    <>
      <main className=" min-h-screen bg-[#09090B] font-lato ">{children}</main>
    </>
  );
};

export default Layout;
