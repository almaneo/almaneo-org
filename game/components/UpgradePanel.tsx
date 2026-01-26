'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import { UPGRADES } from '@/lib/constants';
import UpgradeCard from './UpgradeCard';

export default function UpgradePanel() {
  const { points, upgrades, upgrade } = useGameStore();
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  // Calculate upgrade data
  const upgradeData = [
    {
      type: 'tapPower' as const,
      icon: '🧠',
      title: 'Labeling Speed',
      description: 'Increase efficiency per task',
      currentLevel: upgrades.tapPower,
      maxLevel: UPGRADES.tapPower.maxLevel,
      cost: UPGRADES.tapPower.getCost(upgrades.tapPower + 1),
      effect: `+${UPGRADES.tapPower.getEffect(upgrades.tapPower + 1)}/tap`,
    },
    {
      type: 'autoFarm' as const,
      icon: '🤖',
      title: 'Auto-ML Model',
      description: 'Passive learning while offline',
      currentLevel: upgrades.autoFarm,
      maxLevel: UPGRADES.autoFarm.maxLevel,
      cost: UPGRADES.autoFarm.getCost(upgrades.autoFarm + 1),
      effect: `${UPGRADES.autoFarm.getEffect(upgrades.autoFarm + 1).toFixed(1)}/sec`,
    },
    {
      type: 'energyCapacity' as const,
      icon: '💾',
      title: 'Compute Nodes',
      description: 'Increase max BP capacity',
      currentLevel: upgrades.energyCapacity,
      maxLevel: UPGRADES.energyCapacity.maxLevel,
      cost: UPGRADES.energyCapacity.getCost(upgrades.energyCapacity + 1),
      effect: `Max: ${UPGRADES.energyCapacity.getEffect(upgrades.energyCapacity + 1)}`,
    },
    {
      type: 'energyRegen' as const,
      icon: '❄️',
      title: 'Cooling System',
      description: 'Faster BP recovery',
      currentLevel: upgrades.energyRegen,
      maxLevel: UPGRADES.energyRegen.maxLevel,
      cost: UPGRADES.energyRegen.getCost(upgrades.energyRegen + 1),
      effect: `${UPGRADES.energyRegen.getEffect(upgrades.energyRegen + 1).toFixed(1)}/min`,
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
          gap: isLandscape ? 1 : isMobile ? 1.25 : 2,
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
