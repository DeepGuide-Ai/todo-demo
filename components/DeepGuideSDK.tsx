'use client'

import { useEffect, useState } from 'react'
import { DeepGuideReplay, ExtensionBridge } from '@deepguide/replay-core'
import type { DeepGuideReplayConfig } from '@deepguide/replay-core'

declare global {
  interface Window {
    DeepGuideReplay: typeof DeepGuideReplay;
    __deepguide_sdk_bridge: any;
    startDeepGuideReplay: (flowId: string, mode?: 'guide' | 'edit') => Promise<any>;
    endDeepGuideReplay: () => Promise<any>;
  }
}

interface DeepGuideSDKProps {
  apiKey?: string;
  workspaceId?: string;
  baseUrl?: string;
  autoInit?: boolean;
  enableUI?: boolean;
}

export default function DeepGuideSDK({ 
  apiKey = 'test-api-key-123',
  workspaceId = 'test-workspace',
  baseUrl = 'http://localhost:15001',
  autoInit = true,
  enableUI = true
}: DeepGuideSDKProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replayActive, setReplayActive] = useState(false)
  const [replayInstance, setReplayInstance] = useState<any>(null)

  useEffect(() => {
    // Initialize SDK
    if (!autoInit) return

    const initSDK = () => {
      try {
        // Make SDK available globally
        window.DeepGuideReplay = DeepGuideReplay

        const config: DeepGuideReplayConfig = {
          apiKey,
          workspaceId,
          baseUrl,
          ui: {
            enabled: enableUI,
            containerElement: document.body
          }
        }

        console.log('[DeepGuideSDK] Initializing with config:', config)
        const instance = DeepGuideReplay.init(config)
        setReplayInstance(instance)
        
        // Initialize extension bridge for communication
        ExtensionBridge.init()
        ExtensionBridge.exposeSDKMethods()
        
        setIsInitialized(true)
        console.log('[DeepGuideSDK] SDK initialized successfully')

        // Expose global functions for testing
        window.startDeepGuideReplay = async (stepBlockId: string, mode: 'guide' | 'edit' = 'guide') => {
          try {
            setReplayActive(true)
            await instance.startReplay(stepBlockId, mode, {
              onStepStart: (step: any, index: number) => {
                console.log(`[DeepGuide] Step ${index + 1} started:`, step)
              },
              onStepComplete: (step: any, index: number) => {
                console.log(`[DeepGuide] Step ${index + 1} completed:`, step)
              },
              onComplete: () => {
                console.log('[DeepGuide] Replay completed')
                setReplayActive(false)
              },
              onError: (error: Error) => {
                console.error('[DeepGuide] Replay error:', error)
                setReplayActive(false)
              }
            })
            return { success: true }
          } catch (error) {
            console.error('[DeepGuide] Failed to start replay:', error)
            setReplayActive(false)
            return { success: false, error }
          }
        }

        window.endDeepGuideReplay = async () => {
          try {
            await instance.endReplay()
            setReplayActive(false)
            return { success: true }
          } catch (error) {
            console.error('[DeepGuide] Failed to end replay:', error)
            return { success: false, error }
          }
        }

        // Listen for extension commands
        window.addEventListener('message', (event) => {
          if (event.data.type === 'DEEPGUIDE_SDK_COMMAND') {
            console.log('[DeepGuideSDK] Received command from extension:', event.data)
          }
        })

      } catch (err) {
        console.error('[DeepGuideSDK] Failed to initialize:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize SDK')
      }
    }

    // Initialize on mount
    initSDK()
  }, [autoInit, apiKey, workspaceId, baseUrl, enableUI])

  // Quick test buttons for development
  const handleStartTest = async () => {
    if (!replayInstance) return
    try {
      await window.startDeepGuideReplay('test-flow-123', 'guide')
    } catch (error) {
      console.error('Failed to start test replay:', error)
    }
  }

  const handleEndTest = async () => {
    if (!replayInstance) return
    try {
      await window.endDeepGuideReplay()
    } catch (error) {
      console.error('Failed to end test replay:', error)
    }
  }

  // SDK runs invisibly in the background
  // The UnifiedReplayWidget shows all necessary UI
  return null
}