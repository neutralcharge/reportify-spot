
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ReportCard, { Report } from "./ReportCard";

interface ReportsListProps {
  reports: Report[];
  filter?: string;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, filter = "all" }) => {
  // Filter reports based on tab selection
  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <TabsContent value={filter}>
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onViewDetails={(id) => console.log(`View details for report ${id}`)} 
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default ReportsList;
