import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2, FolderOpen, FilePlus } from "lucide-react";
import { motion } from "framer-motion";

export function ConfigScreen({ onBack }: { onBack: () => void }) {
  const [backupFiles, setBackupFiles] = useState<string[]>([]);
  const [backupTime, setBackupTime] = useState("00:00");
  const [outputFolder, setOutputFolder] = useState("");
  const [saveRemotely, setSaveRemotely] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState({
    pathRemote: "",
    sftpUser: "",
    sftpHost: "",
    sftpPort: "22",
    sshKeyPath: `/.ssh/id_rsa`, // Caminho inicial da chave SSH
  });

  // Função para adicionar arquivo no backup
  const handleExplorer = async (type: "file" | "folder") => {
    try {
      const selectedFiles = await window.ipcRenderer.openFileDialog(type); // Selecionar arquivos (não pastas)
      if (selectedFiles && selectedFiles.length > 0) {
        setBackupFiles([...backupFiles, ...selectedFiles]); // Adiciona os arquivos ao array
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivos:", error);
    }
  };

  // Função para remover arquivo do backup
  const handleRemoveFile = (index: number) => {
    setBackupFiles(backupFiles.filter((_, i) => i !== index));
  };

  // Função para salvar as configurações
  const handleSave = () => {
    console.log("Configurações salvas:", {
      backupFiles,
      backupTime,
      outputFolder,
      saveRemotely,
      remoteConfig: saveRemotely ? remoteConfig : null,
    });
    onBack();
  };

  // Função para selecionar a pasta de destino
  const handleFolderSelect = async () => {
    try {
      const selectedFolder = await window.ipcRenderer.openFileDialog("folder");
      if (selectedFolder && selectedFolder.length > 0) {
        setOutputFolder(selectedFolder[0]); // Definir o caminho da pasta selecionada
      }
    } catch (error) {
      console.error("Erro ao selecionar pasta:", error);
    }
  };

  // Função para selecionar o arquivo de chave SSH
  const handleSelectSshKey = async () => {
    try {
      const selectedFile = await window.ipcRenderer.openFileDialog("any"); // Selecionar arquivo
      if (selectedFile && selectedFile.length > 0) {
        setRemoteConfig({
          ...remoteConfig,
          sshKeyPath: selectedFile[0], // Define o caminho do arquivo da chave SSH
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar chave SSH:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-['Inter_var',sans-serif]">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Configurações de Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label className="text-lg font-semibold mb-2 block">
              Arquivos para Backup
            </Label>
            <div className="space-y-2 mb-2">
              {backupFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="truncate flex-1">{file}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={() => handleExplorer("file")} className="w-full">
              Adicionar Arquivo
              <FilePlus className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Label htmlFor="backupTime">Horário do Backup Diário</Label>
            <Input
              id="backupTime"
              type="time"
              value={backupTime}
              onChange={(e) => setBackupTime(e.target.value)}
              className="mt-1"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Label htmlFor="outputFolder">Pasta de Destino dos Backups</Label>
            <div className="flex mt-1">
              <Input
                id="outputFolder"
                type="text"
                value={outputFolder}
                onChange={(e) => setOutputFolder(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => handleFolderSelect()}
                variant="outline"
                className="ml-2"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-2"
          >
            <Switch
              id="saveRemotely"
              checked={saveRemotely}
              onCheckedChange={setSaveRemotely}
            />
            <Label htmlFor="saveRemotely">Salvar Remotamente</Label>
          </motion.div>

          {saveRemotely && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="pathRemote">Caminho Remoto</Label>
                <Input
                  id="pathRemote"
                  value={remoteConfig.pathRemote}
                  onChange={(e) =>
                    setRemoteConfig({
                      ...remoteConfig,
                      pathRemote: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sftpUser">Usuário SFTP</Label>
                <Input
                  id="sftpUser"
                  value={remoteConfig.sftpUser}
                  onChange={(e) =>
                    setRemoteConfig({
                      ...remoteConfig,
                      sftpUser: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sftpHost">Host SFTP</Label>
                <Input
                  id="sftpHost"
                  value={remoteConfig.sftpHost}
                  onChange={(e) =>
                    setRemoteConfig({
                      ...remoteConfig,
                      sftpHost: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sftpPort">Porta SFTP</Label>
                <Input
                  id="sftpPort"
                  value={remoteConfig.sftpPort}
                  onChange={(e) =>
                    setRemoteConfig({
                      ...remoteConfig,
                      sftpPort: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sshKeyPath">Caminho da Chave SSH</Label>
                <div className="flex mt-1">
                  <Input
                    id="sshKeyPath"
                    value={remoteConfig.sshKeyPath}
                    onChange={(e) =>
                      setRemoteConfig({
                        ...remoteConfig,
                        sshKeyPath: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSelectSshKey}
                    variant="outline"
                    className="ml-2"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-between pt-4"
          >
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
            >
              <Save className="w-5 h-5" />
              <span>Salvar</span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
