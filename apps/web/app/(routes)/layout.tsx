import Navbar from "../../components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <>
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
        <Navbar />
        {children}
    </div>
    </>;
};

export default Layout;