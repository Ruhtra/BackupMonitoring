"use client";

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

export function BackupTimeSection({ form }: { form: UseFormReturn<any> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <FormField
        control={form.control}
        name="backupTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="backupTime">Horário do Backup Diário</FormLabel>
            <Input id="backupTime" type="time" {...field} className="mt-1" />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
