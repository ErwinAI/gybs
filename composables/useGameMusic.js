import { ref } from 'vue'

export function useGameMusic() {
  const conductor = ref(null)
  let retryCount = 0
  const MAX_RETRIES = 50
  
  const initMusic = () => {
    if (process.server) return
    
    const tryInit = () => {
      if (typeof window.BandJS === 'undefined') {
        retryCount++
        if (retryCount > MAX_RETRIES) return
        setTimeout(tryInit, 100)
        return
      }
    }

    tryInit()
  }

  const createEarlyGameMusic = (conductor) => {
    const lead = conductor.createInstrument('square', 'oscillators')
    const bass = conductor.createInstrument('triangle', 'oscillators')
    const arp = conductor.createInstrument('sawtooth', 'oscillators')
    
    // Main melody
    lead
      .note('eighth', 'E5').note('eighth', 'G5')
      .note('eighth', 'A5').note('eighth', 'B5')
      .note('quarter', 'G5')
      .note('eighth', 'A5').note('eighth', 'E5')
      
      .note('eighth', 'D5').note('eighth', 'E5')
      .note('eighth', 'G5').note('eighth', 'A5')
      .note('quarter', 'E5')
      .note('eighth', 'G5').note('eighth', 'D5')

      .note('eighth', 'C5').note('eighth', 'E5')
      .note('eighth', 'G5').note('eighth', 'A5')
      .note('quarter', 'E5')
      .note('eighth', 'G5').note('eighth', 'C5')
      
      .note('eighth', 'B4').note('eighth', 'D5')
      .note('eighth', 'E5').note('eighth', 'G5')
      .note('quarter', 'D5')
      .note('eighth', 'E5').note('eighth', 'B4')

    // Bass line (4 times)
    for (let i = 0; i < 4; i++) {
      bass
        .note('eighth', 'E2').note('eighth', 'E3')
        .note('eighth', 'E2').note('eighth', 'E3')
        .note('eighth', 'G2').note('eighth', 'G3')
        .note('eighth', 'G2').note('eighth', 'G3')
        
        .note('eighth', 'D2').note('eighth', 'D3')
        .note('eighth', 'D2').note('eighth', 'D3')
        .note('eighth', 'C2').note('eighth', 'C3')
        .note('eighth', 'B2').note('eighth', 'B3')
    }

    // Arpeggio (8 times)
    for (let i = 0; i < 8; i++) {
      arp
        .note('sixteenth', 'E4').note('sixteenth', 'G4')
        .note('sixteenth', 'B4').note('sixteenth', 'E5')
        .note('sixteenth', 'G4').note('sixteenth', 'B4')
        .note('sixteenth', 'E5').note('sixteenth', 'G5')
        .note('sixteenth', 'D4').note('sixteenth', 'F4')
        .note('sixteenth', 'A4').note('sixteenth', 'D5')
        .note('sixteenth', 'F4').note('sixteenth', 'A4')
        .note('sixteenth', 'D5').note('sixteenth', 'F5')
    }
  }

  const createMidGameMusic = (conductor) => {
    const lead = conductor.createInstrument('square', 'oscillators')
    const bass = conductor.createInstrument('triangle', 'oscillators')
    const harmony = conductor.createInstrument('sawtooth', 'oscillators')
    
    // Minor key melody for darker feel
    lead
      .note('eighth', 'E4').note('eighth', 'G4')
      .note('eighth', 'A4').note('eighth', 'C5')
      .note('quarter', 'B4')
      .note('eighth', 'A4').note('eighth', 'E4')
      .note('quarter', 'G4')
      .note('quarter', 'A4')
      
    // Driving bass line
    for (let i = 0; i < 4; i++) {
      bass
        .note('eighth', 'E2')
        .note('eighth', 'B2')
        .note('eighth', 'E2')
        .note('eighth', 'C3')
        .note('eighth', 'A2')
        .note('eighth', 'E2')
        .note('eighth', 'G2')
        .note('eighth', 'B2')
    }

    // Tense arpeggios
    for (let i = 0; i < 8; i++) {
      harmony
        .note('sixteenth', 'E3')
        .note('sixteenth', 'G3')
        .note('sixteenth', 'B3')
        .note('sixteenth', 'E4')
    }
  }

  const createLateGameMusic = (conductor) => {
    const lead = conductor.createInstrument('sawtooth', 'oscillators')
    const bass = conductor.createInstrument('square', 'oscillators')
    const pulse = conductor.createInstrument('triangle', 'oscillators')
    
    // Frantic melody in minor key
    lead
      .note('sixteenth', 'E3').note('sixteenth', 'G3')
      .note('sixteenth', 'C4').note('sixteenth', 'G3')
      .note('eighth', 'E3')
      .note('sixteenth', 'G3').note('sixteenth', 'C4')
      .note('eighth', 'E3')
      .note('sixteenth', 'G3').note('sixteenth', 'C4')
      .note('sixteenth', 'E3').note('sixteenth', 'G3')
      .note('eighth', 'C3')
    
    // Rapid, pounding bass line
    for (let i = 0; i < 4; i++) {
      bass
        .note('sixteenth', 'C2').note('sixteenth', 'C2')
        .note('eighth', 'G2')
        .note('sixteenth', 'C2').note('sixteenth', 'C2')
        .note('eighth', 'E2')
    }

    // Urgent pulsing high notes
    for (let i = 0; i < 8; i++) {
      pulse
        .note('sixteenth', 'E4')
        .note('sixteenth', 'C4')
        .note('sixteenth', 'G3')
        .note('sixteenth', 'E3')
        .note('sixteenth', 'G3')
        .note('sixteenth', 'C4')
        .note('sixteenth', 'E4')
        .note('sixteenth', 'G4')
    }
  }

  const createMusic = (level = 1) => {
    try {
      conductor.value = new window.BandJS('equalTemperament', 'northAmerican')
      conductor.value.setTimeSignature(4, 4)
      
      // More aggressive tempo scaling for late game
      const tempo = level <= 3 ? 120 + (level * 5) :  // Early game: gradual increase
                   level <= 7 ? 140 + ((level - 3) * 8) :  // Mid game: faster
                   180 + ((level - 7) * 10)  // Late game: very fast!
      
      conductor.value.setTempo(tempo)

      if (level <= 3) {
        createEarlyGameMusic(conductor.value)
      } else if (level <= 7) {
        createMidGameMusic(conductor.value)
      } else {
        createLateGameMusic(conductor.value)
      }

      conductor.value = conductor.value.finish()
      return true
    } catch (error) {
      console.error('Music initialization failed:', error)
      return false
    }
  }

  const playMusic = (level = 1) => {
    if (process.server) return
    
    try {
      // Always stop current music before starting new
      if (conductor.value) {
        conductor.value.stop()
      }
      
      // Create new music for current level
      if (!createMusic(level)) return
      
      conductor.value.loop(true)
      conductor.value.play()
    } catch (error) {
      console.error('Music playback failed')
    }
  }

  const stopMusic = () => {
    if (process.server) return
    try {
      conductor.value?.stop()
    } catch (error) {
      console.error('Music stop failed')
    }
  }

  return {
    initMusic,
    playMusic,
    stopMusic
  }
} 