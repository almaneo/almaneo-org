'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import { UPGRADES } from '@/lib/constants';
import UpgradeCard from './UpgradeCard';

export default function UpgradePanel() {
  const { points, upgrades, upgrade } = useGameStore();
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  // Calculate upgrade data
  const upgradeData = [
    {
      type: 'tapPower' as const,
      icon: '👆',
      title: 'Tap Power',
      description: 'Increase points per tap',
      currentLevel: upgrades.tapPower,
      maxLevel: UPGRADES.tapPower.maxLevel,
      cost: UPGRADES.tapPower.getCost(upgrades.tapPower + 1),
      effect: `+${UPGRADES.tapPower.getEffect(upgrades.tapPower + 1)} per tap`,
    },
    {
      type: 'autoFarm' as const,
      icon: '🤖',
      title: 'Auto Farm',
      description: 'Earn points while offline',
      currentLevel: upgrades.autoFarm,
      maxLevel: UPGRADES.autoFarm.maxLevel,
      cost: UPGRADES.autoFarm.getCost(upgrades.autoFarm + 1),
      effect: `${UPGRADES.autoFarm.getEffect(upgrades.autoFarm + 1).toFixed(1)} pts/sec`,
    },
    {
      type: 'energyCapacity' as const,
      icon: '⚡',
      title: 'Energy Capacity',
      description: 'Increase max energy',
      currentLevel: upgrades.energyCapacity,
      maxLevel: UPGRADES.energyCapacity.maxLevel,
      cost: UPGRADES.energyCapacity.getCost(upgrades.energyCapacity + 1),
      effect: `Max: ${UPGRADES.energyCapacity.getEffect(upgrades.energyCapacity + 1)}`,
    },
    {
      type: 'energyRegen' as const,
      icon: '⏱️',
      title: 'Energy Regen',
      description: 'Faster energy recovery',
      currentLevel: upgrades.energyRegen,
      maxLevel: UPGRADES.energyRegen.maxLevel,
      cost: UPGRADES.energyRegen.getCost(upgrades.energyRegen + 1),
      effect: `${UPGRADES.energyRegen.getEffect(upgrades.energyRegen + 1).toFixed(1)} pts/min`,
    },
  ];

  return (
    <Box>
      {/* Upgrade Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isLandscape 
            ? 'repeat(2, 1fr)' 
            : {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
          gap: isLandscape ? 1.5 : 2,
        }}
      >
        {upgradeData.map((data) => (
          <UpgradeCard
            key={data.type}
            icon={data.icon}
            name={data.title}
            description={data.description}
            level={data.currentLevel}
            maxLevel={data.maxLevel}
            effect={data.effect}
            cost={data.cost}
            canAfford={points >= data.cost && data.currentLevel < data.maxLevel}
            onUpgrade={() => upgrade(data.type)}
          />
        ))}
      </Box>
    </Box>
  );
}
