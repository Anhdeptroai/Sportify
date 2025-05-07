type Props = {
    onSelectTab: (tab: string) => void;
    onLogout: () => void;
    selectedTab: string;
  };
  
  export function Admin_navbar({ onSelectTab, onLogout, selectedTab }: Props) {
    const tabList = ['Song', 'User', 'Participant', 'Artist', 'Album'];
  
    return (
      <div className="fixed top-30 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-4 gap-4 overflow-y-auto">
        {tabList.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`py-4 px-5 rounded-lg text-left font-bold text-xl cursor-pointer hover:bg-gray-700 ${
              selectedTab === tab ? 'bg-gray-700' : ''
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="py-2 px-4 rounded-lg bg-gray-700 hover:bg-red-700 font-bold cursor-pointer"
        >
          Log out
        </button>
      </div>
    );
  }
  