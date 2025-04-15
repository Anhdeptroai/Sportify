function Sidebar(){
    return <div className="bg-gray-800 h-[calc(100vh-23vh)] w-150 m-2 rounded-2xl text-white">
        <div className="p-4">
            <div className="flex relative">
                <h2 className="text-xl font-bold mb-5">Thư viện</h2>
                <button className="absolute fab fa-plus text-white right-2 p-2 hover:bg-gray-700 hover:rounded-2qxl"></button>
            </div>        

            <div className="h-50 overflow-y-scroll">
                <div className="bg-gray-900 p-4 rounded-lg mb-4">
                    <h3 className="font-bold">Tạo danh sách phát đầu tiên của bạn</h3>
                    <p className="text-sm text-gray-400">Rất dễ! Chúng tôi sẽ giúp bạn</p>
                    <button className="mt-2 px-4 py-1 bg-white text-black rounded-lg">Tạo danh sách phát</button>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-bold">Hãy cùng tìm và theo dõi một số podcast</h3>
                    <p className="text-sm text-gray-400">Khám phá nội dung thú vị</p>
                    <button className="mt-2 px-4 py-1 bg-white text-black rounded-lg">Duyệt xem Podcast</button>
                </div>
            </div>
            
            <div className="mt-5 text-sm text-gray-400">
                <p>Pháp lý • Quyền riêng tư • Cookie</p>
            </div>
        </div>
    </div>
}

export default Sidebar