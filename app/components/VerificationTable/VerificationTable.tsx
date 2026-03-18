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
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Designer</th>
                        <th className="py-2 px-4">Business</th>
                        <th className="py-2 px-4">Submitted</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-4">{item.designer}</td>
                            <td className="py-2 px-4">{item.business}</td>
                            <td className="py-2 px-4">{item.submitted}</td>
                            <td className="py-2 px-4">{item.actions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerificationTable;