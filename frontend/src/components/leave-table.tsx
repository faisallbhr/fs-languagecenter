import { Leave } from "@/types/response/leave";

interface LeaveTableProps {
  data: Leave[] | undefined;
  pendingData: boolean;
  role: string;
  onStatusChange: (id: string, status: string) => void;
}

const LeaveTable = ({
  data,
  pendingData,
  role,
  onStatusChange,
}: LeaveTableProps) => {
  if (pendingData) return <div className="text-center my-4">Loading...</div>;
  if (!data?.length)
    return <div className="text-center my-4">No data available.</div>;

  return (
    <div className="my-4 overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-zinc-900">
            <th className="py-2 whitespace-nowrap">No.</th>
            <th className="py-2 whitespace-nowrap">Name</th>
            <th className="py-2 whitespace-nowrap">Date of Leave</th>
            <th className="py-2 whitespace-nowrap">Reason</th>
            <th className="py-2 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id} className="text-center border-b">
              <td className="py-1 px-4">{index + 1}</td>
              <td className="py-1 px-4">{item.userInfo.name}</td>
              <td className="py-1 px-4">
                {new Date(item.startDate).toLocaleDateString()} -{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </td>
              <td className="py-1 px-4 line-clamp-2 max-w-80 mx-auto">
                {item.reason}
              </td>
              <td className="py-1 px-4">
                {role === "admin" ? (
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item._id, e.target.value)}
                    className={`capitalize text-center pl-2 pr-2.5 py-1 w-fit mx-auto rounded-xl text-sm font-semibold appearance-none ${
                      item.status === "approved"
                        ? "bg-green-500"
                        : item.status === "pending"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}>
                    <option value="approved" className="bg-green-500">
                      Approved
                    </option>
                    <option value="rejected" className="bg-red-500">
                      Rejected
                    </option>
                    <option value="pending" className="bg-orange-500">
                      Pending
                    </option>
                  </select>
                ) : (
                  <div
                    className={`capitalize px-2 py-1 w-fit mx-auto rounded-xl text-sm font-semibold ${
                      item.status === "approved"
                        ? "bg-green-500"
                        : item.status === "pending"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}>
                    {item.status}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
