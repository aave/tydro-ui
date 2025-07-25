import { Trans } from '@lingui/macro';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ReactNode, useEffect, useState } from 'react';
import { MarketLogo } from 'src/components/MarketSwitcher';
import { Link } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';

interface TopBarNotifyProps {
  notifyText: ReactNode;
  learnMoreLink?: string | (() => void);
  buttonText?: string;
  bannerVersion: string;
  icon?: string;
  customIcon?: ReactNode;
  showActionButton?: boolean;
}

export default function TopBarNotify({
  notifyText,
  learnMoreLink,
  buttonText,
  bannerVersion,
  icon,
  customIcon,
  showActionButton = true,
}: TopBarNotifyProps) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const sm = useMediaQuery(breakpoints.down('sm'));

  const [showWarning, setShowWarning] = useState(() => {
    const storedBannerVersion = localStorage.getItem('bannerVersion');
    const warningBarOpen = localStorage.getItem('warningBarOpen');

    if (storedBannerVersion !== bannerVersion) {
      return true;
    }

    return warningBarOpen !== 'false';
  });

  const mobileDrawerOpen = useRootStore((state) => state.mobileDrawerOpen);

  useEffect(() => {
    const storedBannerVersion = localStorage.getItem('bannerVersion');

    if (storedBannerVersion !== bannerVersion) {
      localStorage.setItem('bannerVersion', bannerVersion);
      localStorage.setItem('warningBarOpen', 'true');
      setShowWarning(true);
    }
  }, [bannerVersion]);

  const handleClose = () => {
    localStorage.setItem('warningBarOpen', 'false');
    setShowWarning(false);
  };

  // Note: hide warnings when mobile menu is open
  if (mobileDrawerOpen) return null;

  if (showWarning) {
    return (
      <AppBar
        component="header"
        sx={{
          padding: `8px, 24px, 8px, 12px`,
          background: '#7137EF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0,
          height: '36px',
        }}
        position="static"
      >
        <Toolbar
          sx={{
            display: 'flex',
            paddingRight: md ? 0 : '',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '36px',
            height: '36px',
            padding: 0,
          }}
          variant="dense"
        >
          <Box
            sx={{
              padding: md ? '0 10px' : '0 12px',
              paddingRight: 0,
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography
              sx={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}
              component="div"
            >
              <Trans>{notifyText}</Trans>

              {customIcon ? customIcon : null}

              {icon && !sm ? <MarketLogo sx={{ ml: 2 }} size={32} logo={icon} /> : ''}

              {learnMoreLink && showActionButton && md ? (
                typeof learnMoreLink === 'string' ? (
                  <Link
                    sx={{ color: 'white', textDecoration: 'underline', paddingLeft: 2 }}
                    // target={'_blank'} Todo option to pass as prop
                    href={learnMoreLink}
                  >
                    <Trans>{buttonText ? buttonText : `Learn more`}</Trans>
                  </Link>
                ) : (
                  <Button
                    sx={{
                      color: 'white',
                      textDecoration: 'underline',
                      paddingLeft: 2,
                      background: 'none',
                      textTransform: 'none',
                      minWidth: 'auto',
                      padding: 0,
                      marginLeft: 2,
                    }}
                    onClick={learnMoreLink}
                  >
                    <Trans>{buttonText ? buttonText : `Swap Now`}</Trans>
                  </Button>
                )
              ) : null}
            </Typography>
          </Box>

          <Box>
            {!md && learnMoreLink && showActionButton ? (
              typeof learnMoreLink === 'string' ? (
                <Button
                  component="a"
                  // target={'_blank'} Todo option to pass as prop
                  size="small"
                  href={learnMoreLink}
                  sx={{
                    minWidth: '90px',
                    marginLeft: 5,
                    height: '24px',
                    background: '#383D51',
                    color: '#EAEBEF',
                  }}
                >
                  <Trans> {buttonText ? buttonText.toUpperCase() : `LEARN MORE`}</Trans>
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={learnMoreLink}
                  sx={{
                    minWidth: '90px',
                    marginLeft: 5,
                    height: '24px',
                    background: '#383D51',
                    color: '#EAEBEF',
                  }}
                >
                  <Trans> {buttonText ? buttonText.toUpperCase() : `Swap Now`}</Trans>
                </Button>
              )
            ) : null}
          </Box>
          <Button
            sx={{ color: 'white', paddingRight: 0 }}
            onClick={handleClose}
            startIcon={<CloseIcon />}
          />
        </Toolbar>
      </AppBar>
    );
  }
  return null;
}
