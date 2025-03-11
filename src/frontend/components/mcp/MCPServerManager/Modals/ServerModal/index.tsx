'use client';

import React, { useState, useEffect } from 'react';
import { ServerModalProps } from './types';
import { MCPServerConfig } from '@/utils/mcp/';
import GitHubTab from './tabs/GitHubTab';
import LocalServerTab from './tabs/LocalServerTab';
import SmitheryTab from './tabs/SmitheryTab';
import { useThemeUtils } from '@/frontend/utils/theme';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialConfig,
  onUpdate,
  onRestartAfterUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'local' | 'smithery'>('github');
  
  // Store parsed configuration from GitHub tab
  const [parsedConfig, setParsedConfig] = useState<MCPServerConfig | null>(null);
  
  // Track which tabs have been visited/initialized
  const [initializedTabs, setInitializedTabs] = useState<{
    github: boolean;
    local: boolean;
    smithery: boolean;
  }>({
    github: false,
    local: false,
    smithery: false
  });

  // Initialize fields only on first visit to each tab in add mode
  useEffect(() => {
    if (!initialConfig && !initializedTabs[activeTab]) {
      // Mark this tab as visited
      setInitializedTabs(prev => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab, initialConfig, initializedTabs]);

  const { getThemeValue } = useThemeUtils();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: 'github' | 'local' | 'smithery') => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          maxWidth: '95vw',
          maxHeight: '95vh',
          height: 'auto',
        }
      }}
    >
      <DialogTitle 
        component="div"
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 1
        }}
      >
        <Typography variant="h6">
          {initialConfig ? `Edit MCP Server: ${initialConfig.name}` : 'Add MCP Server'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Only show tabs in creation mode, not in edit mode */}
        {!initialConfig ? (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              aria-label="server configuration tabs"
              sx={{ px: 2 }}
            >
              <Tab label="GitHub" value="github" />
              <Tab label="Local Server" value="local" />
              <Tab label="Install from Registry" value="smithery" />
            </Tabs>
          </Box>
        ) : null}

        <Box sx={{ p: 3 }}>
          {/* Render the active tab or the edit form */}
          {initialConfig ? (
            <LocalServerTab
              initialConfig={initialConfig}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onClose={onClose}
              onRestartAfterUpdate={onRestartAfterUpdate}
            />
          ) : activeTab === 'github' ? (
            <GitHubTab
              onAdd={onAdd}
              onClose={onClose}
              setActiveTab={setActiveTab}
              onUpdate={(config) => setParsedConfig(config)}
            />
          ) : activeTab === 'local' ? (
            <LocalServerTab
              initialConfig={parsedConfig}
              onAdd={onAdd}
              onClose={onClose}
            />
          ) : (
            <SmitheryTab
              onAdd={onAdd}
              onClose={onClose}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ServerModal;
