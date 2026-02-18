import { AppLayout } from "@/components/AppLayout";
import { Upload, FileSpreadsheet, Check } from "lucide-react";
import { useState } from "react";

export default function ImportPage() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Excel Import</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Upload your Grim Execution Sheet to populate the board
          </p>
        </div>

        <div className="max-w-xl">
          <div
            className="grim-card p-12 border-dashed border-2 text-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setUploaded(true)}
          >
            {uploaded ? (
              <div className="animate-slide-in">
                <Check className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">File Imported</h3>
                <p className="text-sm text-muted-foreground">
                  Grim_Execution_Sheet.xlsx has been loaded. Tasks populated on the board.
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your Excel file here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports .xlsx files from the Grim Execution Sheet format
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Grim_Execution_Sheet.xlsx</span>
                </div>
              </>
            )}
          </div>

          {uploaded && (
            <div className="mt-6 grim-card p-4 animate-slide-in">
              <h4 className="text-sm font-semibold text-foreground mb-3">Imported Data</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Daily Plan Shoot</span>
                  <span className="font-mono text-primary">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span>To Do Sammlung</span>
                  <span className="font-mono text-primary">19 tasks</span>
                </div>
                <div className="flex justify-between">
                  <span>Goals & Tracking</span>
                  <span className="font-mono text-primary">11 goals</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
