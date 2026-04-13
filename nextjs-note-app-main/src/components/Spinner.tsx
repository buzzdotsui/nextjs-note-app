'use client'

import React from 'react';

export const Spinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-12 w-12 rounded-full border-4 border-amber-300/30 border-t-amber-300 animate-spin"></div>
  </div>
);
