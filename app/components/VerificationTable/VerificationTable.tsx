import React from 'react';

interface Verification {
    designer: string;
    business: string;
    submitted: string;
    actions: React.ReactNode;
}

interface VerificationTableProps {
    data: Verification[];
}

const VerificationTable: React.FC<VerificationTableProps> = ({ data }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Pending Verifications</h3>
            <table className="w-full text-xs md:text-base text-left">
                <thead>
                    <tr>
                        <th className="py-2 px-2">Designer</th>
                        <th className="py-2 px-2">Business</th>
                        <th className="py-2 px-2 hidden sm:table-cell">Submitted</th>
                        <th className="py-2 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-2 truncate">{item.designer}</td>
                            <td className="py-2 px-2 truncate">{item.business}</td>
                            <td className="py-2 px-2 hidden sm:table-cell">{item.submitted}</td>
                            <td className="py-2 px-2 flex gap-2">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] sm:text-base">Verify</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded text-[10px] sm:text-base">Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerificationTable;