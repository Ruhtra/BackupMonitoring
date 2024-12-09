"use client";

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";

export function BackupTimeSection({ form }: { form: UseFormReturn<any> }) {
  const [displayTime, setDisplayTime] = useState("00:00");

  useEffect(() => {
    const cronExpression = form.getValues("backupTime");
    console.log("cron");

    console.log(cronExpression);
    if (cronExpression) {
      const [_seconds, hour, minute] = cronExpression.split(" ");
      setDisplayTime(`${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    }
  }, [form]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(":");
    const cronExpression = `00 ${hours} ${minutes} * * *`;
    form.setValue("backupTime", cronExpression);
    setDisplayTime(event.target.value);
  };

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
            <Input
              id="backupTime"
              type="time"
              value={displayTime}
              onChange={handleTimeChange}
              className="mt-1"
            />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
