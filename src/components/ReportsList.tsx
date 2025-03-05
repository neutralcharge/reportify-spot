
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ReportCard, { Report } from "./ReportCard";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface ReportsListProps {
  reports: Report[];
  filter?: string;
  onReportClick?: (report: Report) => void;
  selectedReportId?: string;
}

const ReportsList: React.FC<ReportsListProps> = ({ 
  reports, 
  filter = "all",
  onReportClick,
  selectedReportId 
}) => {
  // Filter reports based on tab selection
  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <TabsContent value={filter}>
      <div className="space-y-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div 
              key={report.id} 
              className={`transition-all duration-200 ${selectedReportId === report.id ? 'scale-[1.02] ring-2 ring-primary/50 rounded-lg' : ''}`}
            >
              <ReportCard 
                report={report} 
                onViewDetails={(id) => {
                  console.log(`View details for report ${id}`);
                  if (onReportClick) onReportClick(report);
                }} 
                isSelected={selectedReportId === report.id}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed rounded-lg">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no reports in this category yet.
            </p>
            <div className="flex mt-6 gap-2">
              <Badge variant="outline">
                {filter === "all" ? "All Reports" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Badge>
              <Badge variant="outline">{reports.length} Total Reports</Badge>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default ReportsList;
