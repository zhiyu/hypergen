import React from 'react';
import { Box, Container, Typography, Link, Divider, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import EditNoteIcon from '@mui/icons-material/EditNote';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 5, 
        mt: 'auto', 
        backgroundColor: 'grey.50',
        borderTop: 1,
        borderColor: 'grey.100'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  position: 'relative'
                }}
              >
                <EditNoteIcon 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: 24,
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))'
                  }} 
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    right: -2,
                    bottom: -2,
                    width: 8,
                    height: 8,
                    backgroundColor: 'secondary.main',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 1.5px white',
                  }}
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800,
                  color: 'text.primary',
                  letterSpacing: '-0.01em',
                  fontFamily: "'Inter', sans-serif",
                  '& span': {
                    color: 'secondary.main'
                  }
                }}
              >
                Write<span>HERE</span>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A general agent framework for long-form writing that achieves human-like adaptive writing 
              through recursive task decomposition.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} WriteHERE
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Product
            </Typography>
            <Box component="ul" sx={{ padding: 0, listStyle: 'none', m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/" color="text.secondary" underline="hover" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/story-generation" color="text.secondary" underline="hover" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Story Generation
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/report-generation" color="text.secondary" underline="hover" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Report Generation
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Resources
            </Typography>
            <Box component="ul" sx={{ padding: 0, listStyle: 'none', m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/about" color="text.secondary" underline="hover" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  About
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link 
                  href="https://github.com/yimengchencs/heterogeneous-recursive-planning" 
                  target="_blank" 
                  rel="noopener"
                  color="text.secondary" 
                  underline="hover" 
                  sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                >
                  Documentation
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link 
                href="https://github.com/yimengchencs/heterogeneous-recursive-planning" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <GitHubIcon sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                  GitHub
                </Typography>
              </Link>
              <Link 
                href="https://arxiv.org/abs/2503.08275" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <ArticleIcon sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                  Paper
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;