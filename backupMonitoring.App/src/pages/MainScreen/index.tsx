import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Settings } from "lucide-react";
import { addHours, differenceInSeconds, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function MainScreen() {
  //remover currentTime
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextBackup, setNextBackup] = useState(addHours(new Date(), 1));
  const [timeUntilBackup, setTimeUntilBackup] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const diffInSeconds = differenceInSeconds(nextBackup, now);
      setTimeUntilBackup(diffInSeconds > 0 ? diffInSeconds : 0);

      if (now >= nextBackup) {
        setNextBackup(addHours(now, 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextBackup]);

  const formatTimeUntilBackup = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Backup Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Data de Hoje</p>
            <p className="text-xl font-bold text-gray-800">
              {format(currentTime, "d MMM yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Próximo Backup</p>
            <p className="text-xl font-bold text-gray-800">
              {format(nextBackup, "HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-blue-50 shadow-inner">
          <p className="text-sm font-medium text-blue-600">
            Tempo até o Próximo Backup
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <p className="text-2xl font-bold text-blue-700">
              {formatTimeUntilBackup(timeUntilBackup)}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Link to={"/config"}>
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
              <Settings className="w-5 h-5" />
              <span>Configurar</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
