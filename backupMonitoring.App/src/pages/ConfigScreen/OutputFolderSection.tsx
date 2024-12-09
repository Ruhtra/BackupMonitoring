"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

export function OutputFolderSection({ form }: { form: UseFormReturn<any> }) {
  const handleFolderSelect = async () => {
    try {
      const selectedFolder = await window.ipcRenderer.openFileDialog("folder");
      if (selectedFolder && selectedFolder.length > 0) {
        form.setValue("outputFolder", selectedFolder[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar pasta:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FormField
        control={form.control}
        name="outputFolder"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="outputFolder">
              Pasta de Destino dos Backups
            </FormLabel>
            <div className="flex mt-1">
              <Input
                id="outputFolder"
                type="text"
                {...field}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleFolderSelect}
                variant="outline"
                className="ml-2"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
