'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Palette, Brush } from "lucide-react";
import { UserProfile } from './types';

const themeColors = [
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Rose', value: '#F43F5E' },
];

interface ProfileCustomizationProps {
  profile: UserProfile;
  onUpdateTheme: (color: string) => void;
}

export function ProfileCustomization({ profile, onUpdateTheme }: ProfileCustomizationProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Palette className="mr-2 h-4 w-4" />
        <span>Personnalisation</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-56">
        <div className="p-2">
          <div className="mb-2 text-sm font-medium">Thème</div>
          <div className="grid grid-cols-4 gap-2">
            {themeColors.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateTheme(color.value)}
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
