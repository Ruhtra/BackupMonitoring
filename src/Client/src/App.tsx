"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Database,
  LucideIcon,
} from "lucide-react";

interface Backup {
  id: string;
  dbName: string;
  statusBackup: "progress" | "success" | "error" | "idle";
  statusSend: "progress" | "success" | "error" | "idle";
  createdAt: string;
}

interface StatusInfo {
  icon: LucideIcon;
  color: string;
}

export function App() {
  const [backups, setBackups] = useState<Backup[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as Backup[];
      setBackups(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const groupedBackups = backups.reduce((acc, backup) => {
    const date = format(parseISO(backup.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(backup);
    return acc;
  }, {} as Record<string, Backup[]>);

  const getStatusInfo = (status: Backup["statusBackup"]): StatusInfo => {
    switch (status) {
      case "progress":
        return { icon: RefreshCw, color: "bg-blue-100 text-blue-800" };
      case "success":
        return { icon: CheckCircle, color: "bg-green-100 text-green-800" };
      case "error":
        return { icon: AlertCircle, color: "bg-red-100 text-red-800" };
      case "idle":
        return { icon: Clock, color: "bg-gray-100 text-gray-800" };
      default:
        return { icon: Clock, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Backup Monitoring
      </h1>
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {Object.entries(groupedBackups).map(([date, dailyBackups]) => (
          <Card key={date} className="overflow-hidden shadow-lg">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="text-xl text-gray-700">
                {format(parseISO(date), "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-gray-200">
                  {dailyBackups.map((backup) => (
                    <div
                      key={backup.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {backup.dbName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(backup.createdAt), "HH:mm:ss")}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {(["statusBackup", "statusSend"] as const).map(
                          (statusType) => {
                            const status = backup[statusType];
                            const { icon: Icon, color } = getStatusInfo(status);
                            return (
                              <Badge
                                key={statusType}
                                variant="outline"
                                className={`flex items-center gap-1 ${color}`}
                              >
                                <Icon className="w-4 h-4" />
                                {status}
                              </Badge>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
