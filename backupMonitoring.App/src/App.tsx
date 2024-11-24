import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Settings } from 'lucide-react'
import { motion } from "framer-motion"
import { format, addHours, differenceInSeconds } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ConfigScreen } from './ConfigScreen'

export function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextBackup, setNextBackup] = useState(addHours(new Date(), 1))
  const [timeUntilBackup, setTimeUntilBackup] = useState(3600)


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      const diffInSeconds = differenceInSeconds(nextBackup, now)
      setTimeUntilBackup(diffInSeconds > 0 ? diffInSeconds : 0)
      
      if (now >= nextBackup) {
        setNextBackup(addHours(now, 1))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nextBackup])

  const formatTimeUntilBackup = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const [showConfig, setShowConfig] = useState(false)

  const MainScreen = () => (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Backup Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Data de Hoje</p>
            <p className="text-xl font-bold text-gray-800">{format(currentTime, 'd MMM yyyy', { locale: ptBR })}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Próximo Backup</p>
            <p className="text-xl font-bold text-gray-800">{format(nextBackup, 'HH:mm', { locale: ptBR })}</p>
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-blue-50 shadow-inner">
          <p className="text-sm font-medium text-blue-600">Tempo até o Próximo Backup</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <p className="text-2xl font-bold text-blue-700">{formatTimeUntilBackup(timeUntilBackup)}</p>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowConfig(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
          >
            <Settings className="w-5 h-5" />
            <span>Configurar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {showConfig ? (
          <ConfigScreen onBack={() => setShowConfig(false)} />
        ) : (
          <MainScreen />
        )}
      </motion.div>
    </div>
  )
}
