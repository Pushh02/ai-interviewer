const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4 backdrop-blur-2xl bg-black/40 rounded-2xl shadow-xl">
            <div className="flex items-center gap-6">
                <h1 className="text-white text-2xl font-bold">Interview AI</h1>
                <nav className="flex gap-4">
                    <a href="/" className="text-gray-300 hover:text-white transition-all duration-200 decoration-2 underline-offset-4">
                        Home
                    </a>
                    <a href="/practice" className="text-gray-300 hover:text-white transition-all duration-200 decoration-2 underline-offset-4">
                        Practice
                    </a>
                    <a href="/history" className="text-gray-300 hover:text-white transition-all duration-200 decoration-2 underline-offset-4">
                        History
                    </a>
                </nav>
            </div>
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                Login
            </button>
        </div>
    )
}

export default Navbar;