import { CogIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Button, ListItemText, Menu, MenuItem, SvgIcon, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { DEFAULT_LOCALE } from 'src/libs/LanguageProvider';
import { useRootStore } from 'src/store/root';
import { SETTINGS } from 'src/utils/events';
import { PROD_ENV } from 'src/utils/marketsAndNetworksConfig';

import { DarkModeSwitcher } from './components/DarkModeSwitcher';
import { LanguageListItem, LanguagesList } from './components/LanguageSwitcher';
import { TestNetModeSwitcher } from './components/TestNetModeSwitcher';

export const LANG_MAP = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  el: 'Greek',
};
type LanguageCode = keyof typeof LANG_MAP;

// Define the type for the language codes

// Example usage

export function SettingsMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const { openReadMode } = useModalContext();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const trackEvent = useRootStore((store) => store.trackEvent);
  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setSettingsOpen(true);
    setLanguagesOpen(false);
  };

  const handleLanguageClick = () => {
    const savedLocale = localStorage.getItem('LOCALE') || DEFAULT_LOCALE;
    const langCode = savedLocale as LanguageCode;
    setSettingsOpen(false);
    setLanguagesOpen(true);
    trackEvent(SETTINGS.LANGUAGE, { language: LANG_MAP[langCode] });
  };

  const handleCloseLanguage = () => {
    setSettingsOpen(true);
    setLanguagesOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSettingsOpen(false);
    setLanguagesOpen(false);
  };

  const handleOpenReadMode = () => {
    setSettingsOpen(false);
    openReadMode();
  };

  return (
    <>
      <Button
        variant="glass"
        aria-label="settings"
        id="settings-button"
        aria-controls={settingsOpen ? 'settings-menu' : undefined}
        aria-expanded={settingsOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleSettingsClick}
        sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
      >
        <SvgIcon sx={{ color: '#F1F1F3' }} fontSize="small">
          <CogIcon />
        </SvgIcon>
      </Button>

      <Menu
        id="settings-menu"
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
        anchorEl={anchorEl}
        open={settingsOpen}
        onClose={handleClose}
        sx={{
          '.MuiMenuItem-root.Mui-disabled': { opacity: 1 },
          '.MuiPaper-root': {
            backgroundColor: (theme) => theme.palette.background.paper,
          },
        }}
        keepMounted={true}
      >
        <MenuItem disabled sx={{ mb: '4px' }}>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>Global settings</Trans>
          </Typography>
        </MenuItem>

        <DarkModeSwitcher component={MenuItem} />
        {PROD_ENV && <TestNetModeSwitcher />}
        <LanguageListItem onClick={handleLanguageClick} component={MenuItem} />
        <MenuItem onClick={handleOpenReadMode}>
          <ListItemText>
            <Trans>Watch wallet</Trans>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        id="settings-menu"
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
        anchorEl={anchorEl}
        open={languagesOpen}
        onClose={handleClose}
        sx={{
          '.MuiPaper-root': {
            backgroundColor: (theme) => theme.palette.background.paper,
          },
        }}
        keepMounted={true}
      >
        <LanguagesList onClick={handleCloseLanguage} component={MenuItem} />
      </Menu>
    </>
  );
}
