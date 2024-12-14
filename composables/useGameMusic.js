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

  const createCalm = (conductor) => {
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

  const createTense = (conductor) => {
    const lead = conductor.createInstrument('square', 'oscillators')
    const bass = conductor.createInstrument('triangle', 'oscillators')
    const harmony = conductor.createInstrument('sawtooth', 'oscillators')
    
    // Set volumes - increase bass volume
    lead.setVolume(0.7)    // Slightly reduce lead to make room for bass
    bass.setVolume(0.9)    // Increase bass volume significantly
    harmony.setVolume(0.6) // Keep harmony slightly lower
    
    // Minor key melody for darker feel
    lead
      .note('eighth', 'E4').note('eighth', 'G4')
      .note('eighth', 'A4').note('eighth', 'C5')
      .note('quarter', 'B4')
      .note('eighth', 'A4').note('eighth', 'E4')
      .note('quarter', 'G4')
      .note('quarter', 'A4')
      
    // Driving bass line - moved up an octave for better audibility
    for (let i = 0; i < 4; i++) {
      bass
        .note('eighth', 'E3')  // Was E2
        .note('eighth', 'B3')  // Was B2
        .note('eighth', 'E3')  // Was E2
        .note('eighth', 'C4')  // Was C3
        .note('eighth', 'A3')  // Was A2
        .note('eighth', 'E3')  // Was E2
        .note('eighth', 'G3')  // Was G2
        .note('eighth', 'B3')  // Was B2
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

  const createPanic = (conductor) => {
    const lead = conductor.createInstrument('sawtooth', 'oscillators')
    const bass = conductor.createInstrument('square', 'oscillators')
    const rhythm = conductor.createInstrument('triangle', 'oscillators')
    
    lead.setVolume(0.8)
    bass.setVolume(0.9)
    rhythm.setVolume(0.7)

    // Frantic, urgent melody
    lead.repeatStart()
      .note('sixteenth', 'A4').note('sixteenth', 'C5')
      .note('sixteenth', 'D#5').note('sixteenth', 'E5')
      .note('sixteenth', 'D#5').note('sixteenth', 'C5')
      .note('sixteenth', 'A4').note('sixteenth', 'G#4')
    lead.repeat(4)

    // Driving, pulsing bass
    bass.repeatStart()
      .note('sixteenth', 'A2').note('sixteenth', 'A2')
      .note('sixteenth', 'A2').note('sixteenth', 'A2')
      .note('sixteenth', 'G#2').note('sixteenth', 'G#2')
      .note('sixteenth', 'G2').note('sixteenth', 'G2')
    bass.repeat(8)

    // Tension-building rhythm
    rhythm.repeatStart()
      .note('tripletEighth', 'E4').note('tripletEighth', 'D#4').note('tripletEighth', 'E4')
      .note('tripletEighth', 'A4').note('tripletEighth', 'G#4').note('tripletEighth', 'A4')
    rhythm.repeat(8)
  }

  const createIntense = (conductor) => {
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

  const createSinister = (conductor) => {
    const lead = conductor.createInstrument('sawtooth', 'oscillators')
    const bass = conductor.createInstrument('triangle', 'oscillators')
    const drone = conductor.createInstrument('square', 'oscillators')
    
    // Menacing melody in minor key
    lead.repeatStart()
      .note('quarter', 'D4')
      .note('eighth', 'F4').note('eighth', 'G#4')
      .note('quarter', 'C5')
      .note('eighth', 'B4').note('eighth', 'G#4')
      
      .note('quarter', 'A4')
      .note('eighth', 'F4').note('eighth', 'D4')
      .note('half', 'E4')
    lead.repeat(2)

    // Deep, ominous bass
    bass.repeatStart()
      .note('half', 'D2')
      .note('quarter', 'C#2')
      .note('quarter', 'C2')
    bass.repeat(4)

    // Unsettling background texture
    drone.repeatStart()
      .note('eighth', 'D3').note('eighth', 'D#3')
      .note('eighth', 'E3').note('eighth', 'F3')
      .note('eighth', 'F#3').note('eighth', 'G3')
      .note('eighth', 'G#3').note('eighth', 'A3')
    drone.repeat(4)
  }

  const createFrenzy = (conductor) => {
    const lead = conductor.createInstrument('sawtooth', 'oscillators')
    const bass = conductor.createInstrument('square', 'oscillators')
    const harmony = conductor.createInstrument('triangle', 'oscillators')
    
    lead.setVolume(0.8)
    bass.setVolume(0.9)
    harmony.setVolume(0.7)

    // Wild, frenzied melody
    lead.repeatStart()
      .note('thirtySecond', 'E5').note('thirtySecond', 'G5')
      .note('thirtySecond', 'B5').note('thirtySecond', 'C6')
      .note('sixteenth', 'B5')
      .note('thirtySecond', 'G5').note('thirtySecond', 'E5')
    lead.repeat(8)

    // Intense rhythmic bass
    bass.repeatStart()
      .note('sixteenth', 'E2').note('sixteenth', 'E3')
      .note('sixteenth', 'E2').note('sixteenth', 'D#3')
      .note('sixteenth', 'D2').note('sixteenth', 'D3')
      .note('sixteenth', 'C#2').note('sixteenth', 'C#3')
    bass.repeat(8)

    // Chaotic harmonies
    harmony.repeatStart()
      .note('eighth', 'B4').note('eighth', 'C5')
      .note('eighth', 'B4').note('eighth', 'A#4')
    harmony.repeat(8)
  }

  const createMusic = (level = 1) => {
    try {
      conductor.value = new window.BandJS('equalTemperament', 'northAmerican')
      conductor.value.setTimeSignature(4, 4)
      
      // Adjust base tempo based on level range
      let baseTempo = 120
      if (level <= 5) baseTempo = 120        // Calm
      else if (level <= 10) baseTempo = 140  // Tense
      else if (level <= 15) baseTempo = 140  // Panic
      else if (level <= 20) baseTempo = 135  // Intense
      else if (level <= 25) baseTempo = 150  // Sinister
      else baseTempo = 145                   // Frenzy
      
      const tempo = baseTempo + (level * 0.3)  // Smaller tempo increment per level
      conductor.value.setTempo(tempo)

      // Select music based on level range
      if (level <= 5) {
        createCalm(conductor.value)
      } else if (level <= 10) {
        createTense(conductor.value)
      } else if (level <= 15) {
        createPanic(conductor.value)
      } else if (level <= 20) {
        createIntense(conductor.value)
      } else if (level <= 25) {
        createSinister(conductor.value)
      } else {
        createFrenzy(conductor.value)
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
      if (conductor.value) {
        conductor.value.stop()
      }
      
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