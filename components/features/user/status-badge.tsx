'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserStatus } from "./types";

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig = {
  online: { color: 'bg-green-500', label: 'En ligne' },
  offline: { color: 'bg-gray-400', label: 'Hors ligne' },
  away: { color: 'bg-yellow-500', label: 'Absent' },
  busy: { color: 'bg-red-500', label: 'Occupé' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn("relative", className)}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={cn(
          "absolute -right-1 -top-1 h-3 w-3 rounded-full",
          statusConfig[status].color
        )}
      >
        <span className="sr-only">{statusConfig[status].label}</span>
      </motion.div>
    </motion.div>
  );
}