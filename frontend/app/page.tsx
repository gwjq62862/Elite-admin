import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* ToolBar */}
        <header className="flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-[#1E1E1E] text-gray-800 dark:text-[#E0E0E0] border border-transparent dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 dark:text-[#A0A0A0] hover:text-gray-800 dark:hover:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          
          </div>
        </header>

        {/* PageHeading */}
        <div className="mb-6">
          <h1 className="text-gray-900 dark:text-[#E0E0E0] text-3xl font-black leading-tight tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-[#A0A0A0] text-base font-normal leading-normal mt-1">
            An overview of the system's status and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Posts", value: "1,450" },
            { label: "Published", value: "1,200" },
            { label: "Pending Approval", value: "25" },
            { label: "Drafts", value: "225" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl p-6 bg-gray-100 dark:bg-[#1E1E1E] border border-transparent dark:border-white/10"
            >
              <p className="text-gray-600 dark:text-[#A0A0A0] text-base font-medium leading-normal">
                {stat.label}
              </p>
              <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Posts Table */}
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-[#1E1E1E] rounded-xl p-6 border border-transparent dark:border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="flex items-center gap-2">
              <select className="bg-gray-200 dark:bg-background-dark border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2">
                <option defaultValue="filter">Filter by status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-300 dark:border-white/20">
                <tr>
                  {[
                    "Thumbnail",
                    "Title",
                    "Status",
                    "Date Added",
                    "Actions",
                  ].map((head, i) => (
                    <th
                      key={i}
                      className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#A0A0A0] ${
                        head === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {/* Sample Row 1 */}
                <tr className="hover:bg-gray-200 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div
                      className="w-24 h-14 bg-cover bg-center rounded-md"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-lQjaJDgwnsY4nublWN7fNKR5EceNhXyz0fAvUduPqemBGlYuooZ1U79IIkeOyAAa_rGk-ztNycr3aVVeK_wKt_zgkb2IBwyfVHZP2PdYFUMibOP1QKPBP3himUVTvVQ7CZ39yuJku_FVKs52XHOF2wLDqBKmlpjEJJKqLnMHKggi2-NYA5r39zOrnn-HTJHDXNY4ODBKk1qoSZ03FBt040QWZehPmFCxxQ7jaM1gZhMQlacLN-kZ-q-GkZJGdZb-wv7MTCuTqOMp')",
                      }}
                    ></div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                    The Future of UI Design
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">
                      Published
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    2023-10-27
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-1">
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </button>
                    <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
