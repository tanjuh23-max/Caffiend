@echo off
title Caffiend - Build
echo.
echo  Building Caffiend for production...
echo.
npm run build
echo.
echo  Build complete! Output is in the /dist folder.
echo  This can be deployed to any static host (Netlify, Vercel, GitHub Pages).
echo.
pause
