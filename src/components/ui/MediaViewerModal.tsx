"use client";

import React, { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'pdf';
  fileName?: string;
}

export default function MediaViewerModal({ 
  isOpen, 
  onClose, 
  mediaUrl, 
  mediaType, 
  fileName 
}: MediaViewerModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          event.preventDefault();
          handleZoomIn();
          break;
        case '-':
          event.preventDefault();
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          handleRotate();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-[90vw] h-[90vh]'} bg-[#0a0a0a] rounded-lg shadow-2xl pointer-events-auto flex flex-col transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              {mediaType === 'image' ? 'Image Viewer' : 'PDF Viewer'}
            </h3>
            {fileName && (
              <span className="text-sm text-gray-400">• {fileName}</span>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            {mediaType === 'image' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <span className="text-sm text-gray-400 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
                  disabled={zoom >= 300}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRotate}
                  className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white text-xs"
                >
                  Reset
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 text-gray-400 hover:bg-white/20 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden bg-transparent relative">
          {mediaType === 'image' ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={mediaUrl}
                alt="Viewer"
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <iframe
                src={`${mediaUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          )}
        </div>
        
        {/* Footer with shortcuts */}
        <div className="px-4 py-2 border-t border-white/20 bg-[#111111]">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {mediaType === 'image' 
                ? 'Use +/- to zoom, R to rotate, ESC to close' 
                : 'ESC to close'
              }
            </span>
            <span className="font-mono">
              {mediaType === 'image' && `${zoom}% • ${rotation}°`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
