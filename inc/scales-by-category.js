/* scales-by-category.js */
/* a javascript library of musical scales */
/*
  This library has been written as a contribution to the
  MIDI 2 Lasercutter project. The github repo for this  
  project can be found under:                      
  http://gitter.im/Wintergatan/Midi-to-laser-cutter
*/

/* 
  Author:   Jørgen W. Lang
  Email:    jwl@worldmusic.de
  Version:  0.0.1
*/

/* 
  scalesByCategory contains a collection of musical scales
  (series of musical notes), ordered by categories in the form
  of JS objects.
  
  It is based on the "tonal" JS library (the "scale" part):
  http://danigb.github.io/tonal
  
  This library assumes the usual 12 semitones that are common
  in so-called "Western" music as a basic concept.
  
  Each object has the following properties:
  
    name:      the name of the scale
    aliases:   possible aliases or secondary names for the given scale
    semitones: a list of semitones contained in the scale, beginning
               at 0 (root). Semitone 12 (octave) is implied and not
               included.
    category:  the category of the scale (see below for a full list)
    bitmap:    a set of 12 Boolean values representing each semitone
               1 = semitone is part of the scale
               0 = semitone is not part of the scale
    gaps:      the difference or "distance" in semitones between two 
               consecutive notes of the scale. The last "gap" can 
               possibly be omitted if the number of notes in a scale is
               known.
               
    List of modes:
    
    Modal          The common modal scales (ionion/major, mixolydian, etc.)
    Modal Variant  Misc. variations of the usual modal scales
    Pentatonic     Scales consisting of only 5 notes
    Japanese       Scales based on Japanese music systems (for Koto, Shamizen, etc.)
    Misc           Various scales that did not fit any other category
    Blues          Scales common in Blues music
    Indian         Scales that are used in Indian classical music (ragas, etc.)
    Jazz           Typical "Jazz" scales (harmonic minor, augmented, alternate, etc.)
    Neapolitan     Some "exotic" or "enigmatic" scales and their derivatice
                   attributed to John McLaughlin
    Prometheus     A series of scales derived from the so-called "Prometheus" or 
                   "mystic" chord developed by Russian composer Alexander Scriabin
    Misc Ethnic    Various scales from around the world
    Spanish        Some typical "spanish" scales
  
*/

var scalesByCategory = {
   "Modal":[
      {
         "name":"ionian",
         "aliases":[ "major" ],
         "semitones":[ 0, 2, 4, 5, 7, 9, 11 ],
         "category":"Modal",
         "bitmap":101011010101,
         "gaps":[ 2, 2, 1, 2, 2, 2, 1 ]
      },
      {
         "name":"dorian",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 9, 10 ],
         "category":"Modal",
         "bitmap":101101010110,
         "gaps":[ 2, 1, 2, 2, 2, 1, 2 ]
      },
      {
         "name":"phrygian",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 7, 8, 10 ],
         "category":"Modal",
         "bitmap":110101011010,
         "gaps":[ 1, 2, 2, 2, 1, 2, 2 ]
      },
      {
         "name":"lydian",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 7, 9, 11 ],
         "category":"Modal",
         "bitmap":101010110101,
         "gaps":[ 2, 2, 2, 1, 2, 2, 1 ]
      },
      {
         "name":"mixolydian",
         "aliases":[ "dominant" ],
         "semitones":[ 0, 2, 4, 5, 7, 9, 10 ],
         "category":"Modal",
         "bitmap":101011010110,
         "gaps":[ 2, 2, 1, 2, 2, 1, 2 ]
      },
      {
         "name":"aeolian",
         "aliases":[ "minor" ],
         "semitones":[ 0, 2, 3, 5, 7, 8, 10 ],
         "category":"Modal",
         "bitmap":101101011010,
         "gaps":[ 2, 1, 2, 2, 1, 2, 2 ]
      },
      {
         "name":"locrian",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 6, 8, 10 ],
         "category":"Modal",
         "bitmap":110101101010,
         "gaps":[ 1, 2, 2, 1, 2, 2, 2 ]
      }
   ],
   "Modal Variant":[
      {
         "name":"locrian major",
         "aliases":[ "arabian" ],
         "semitones":[ 0, 2, 4, 5, 6, 8, 10 ],
         "category":"Modal Variant",
         "bitmap":101011101010,
         "gaps":[ 2, 2, 1, 1, 2, 2, 2 ]
      },
      {
         "name":"lydian #9",
         "aliases":[],
         "semitones":[ 0, 1, 4, 6, 7, 9, 11 ],
         "category":"Modal Variant",
         "bitmap":110010110101,
         "gaps":[ 1, 3, 2, 1, 2, 2, 1 ]
      },
      {
         "name":"lydian minor",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 7, 8, 10 ],
         "category":"Modal Variant",
         "bitmap":101010111010,
         "gaps":[ 2, 2, 2, 1, 1, 2, 2 ]
      },
      {
         "name":"lydian augmented",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 8, 9, 11 ],
         "category":"Modal Variant",
         "bitmap":101010101101,
         "gaps":[ 2, 2, 2, 2, 1, 2, 1 ]
      },
      {
         "name":"dorian #4",
         "aliases":[],
         "semitones":[ 0, 2, 3, 6, 7, 9, 10 ],
         "category":"Modal Variant",
         "bitmap":101100110110,
         "gaps":[ 2, 1, 3, 1, 2, 1, 2 ]
      },
      {
         "name":"ionian augmented",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 8, 9, 11 ],
         "category":"Modal Variant",
         "bitmap":101011001101,
         "gaps":[ 2, 2, 1, 3, 1, 2, 1 ]
      },
      {
         "name":"locrian #2",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 6, 8, 10 ],
         "category":"Modal Variant",
         "bitmap":101101101010,
         "gaps":[ 2, 1, 2, 1, 2, 2, 2 ]
      },
      {
         "name":"lydian dominant",
         "aliases":[ "lydian b7" ],
         "semitones":[ 0, 2, 4, 6, 7, 9, 10 ],
         "category":"Modal Variant",
         "bitmap":101010110110,
         "gaps":[ 2, 2, 2, 1, 2, 1, 2 ]
      },
      {
         "name":"double harmonic lydian",
         "aliases":[],
         "semitones":[ 0, 1, 4, 6, 7, 8, 11 ],
         "category":"Modal Variant",
         "bitmap":110010111001,
         "gaps":[ 1, 3, 2, 1, 1, 3, 1 ]
      },
      {
         "name":"lydian diminished",
         "aliases":[],
         "semitones":[ 0, 2, 3, 6, 7, 9, 11 ],
         "category":"Modal Variant",
         "bitmap":101100110101,
         "gaps":[ 2, 1, 3, 1, 2, 2, 1 ]
      }
   ],
   "Japanese":[
      {
         "name":"in-sen",
         "aliases":[],
         "semitones":[ 0, 1, 5, 7, 10 ],
         "category":"Japanese",
         "bitmap":110001010010,
         "gaps":[ 1, 4, 2, 3, 2 ]
      },
      {
         "name":"hirajoshi",
         "aliases":[],
         "semitones":[ 0, 2, 3, 7, 8 ],
         "category":"Japanese",
         "bitmap":101100011000,
         "gaps":[ 2, 1, 4, 1, 4 ]
      },
      {
         "name":"ichikosucho",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 6, 7, 9, 11 ],
         "category":"Japanese",
         "bitmap":101011110101,
         "gaps":[ 2, 2, 1, 1, 1, 2, 2, 1 ]
      },
      {
         "name":"kumoijoshi",
         "aliases":[],
         "semitones":[ 0, 1, 5, 7, 8 ],
         "category":"Japanese",
         "bitmap":110001011000,
         "gaps":[ 1, 4, 2, 1, 4 ]
      },
      {
         "name":"iwato",
         "aliases":[],
         "semitones":[ 0, 1, 5, 6, 10 ],
         "category":"Japanese",
         "bitmap":110001100010,
         "gaps":[ 1, 4, 1, 4, 2 ]
      }
   ],
   "Misc":[
      {
         "name":"enigmatic",
         "aliases":[],
         "semitones":[ 0, 1, 4, 6, 8, 10, 11 ],
         "category":"Misc",
         "bitmap":110010101011,
         "gaps":[ 1, 3, 2, 2, 2, 1, 1 ]
      },
      {
         "name":"mystery #1",
         "aliases":[],
         "semitones":[ 0, 1, 4, 6, 8, 10 ],
         "category":"Misc",
         "bitmap":110010101010,
         "gaps":[ 1, 3, 2, 2, 2, 2 ]
      }
   ],
   "Pentatonic":[
      {
         "name":"minor pentatonic",
         "aliases":[],
         "semitones":[ 0, 3, 5, 7, 10 ],
         "category":"Pentatonic",
         "bitmap":100101010010,
         "gaps":[ 3, 2, 2, 3, 2 ]
      },
      {
         "name":"flat three pentatonic",
         "aliases":[ "kumoi" ],
         "semitones":[ 0, 2, 3, 7, 9 ],
         "category":"Pentatonic",
         "bitmap":101100010100,
         "gaps":[ 2, 1, 4, 2, 3 ]
      },
      {
         "name":"ritusen",
         "aliases":[],
         "semitones":[ 0, 2, 5, 7, 9 ],
         "category":"Pentatonic",
         "bitmap":101001010100,
         "gaps":[ 2, 3, 2, 2, 3 ]
      },
      {
         "name":"minor six pentatonic",
         "aliases":[],
         "semitones":[ 0, 3, 5, 7, 9 ],
         "category":"Pentatonic",
         "bitmap":100101010100,
         "gaps":[ 3, 2, 2, 2, 3 ]
      },
      {
         "name":"locrian pentatonic",
         "aliases":[ "minor seven flat five pentatonic" ],
         "semitones":[ 0, 3, 5, 6, 10 ],
         "category":"Pentatonic",
         "bitmap":100101100010,
         "gaps":[ 3, 2, 1, 4, 2 ]
      },
      {
         "name":"lydian dominant pentatonic",
         "aliases":[],
         "semitones":[ 0, 4, 6, 7, 10 ],
         "category":"Pentatonic",
         "bitmap":100010110010,
         "gaps":[ 4, 2, 1, 3, 2 ]
      },
      {
         "name":"super locrian pentatonic",
         "aliases":[],
         "semitones":[ 0, 3, 4, 6, 10 ],
         "category":"Pentatonic",
         "bitmap":100110100010,
         "gaps":[ 3, 1, 2, 4, 2 ]
      },
      {
         "name":"ionian pentatonic",
         "aliases":[],
         "semitones":[ 0, 4, 5, 7, 11 ],
         "category":"Pentatonic",
         "bitmap":100011010001,
         "gaps":[ 4, 1, 2, 4, 1 ]
      },
      {
         "name":"lydian pentatonic",
         "aliases":[ "chinese" ],
         "semitones":[ 0, 4, 6, 7, 11 ],
         "category":"Pentatonic",
         "bitmap":100010110001,
         "gaps":[ 4, 2, 1, 4, 1 ]
      },
      {
         "name":"minor #7M pentatonic",
         "aliases":[],
         "semitones":[ 0, 3, 5, 7, 11 ],
         "category":"Pentatonic",
         "bitmap":100101010001,
         "gaps":[ 3, 2, 2, 4, 1 ]
      },
      {
         "name":"whole tone pentatonic",
         "aliases":[],
         "semitones":[ 0, 4, 6, 8, 10 ],
         "category":"Pentatonic",
         "bitmap":100010101010,
         "gaps":[ 4, 2, 2, 2, 2 ]
      },
      {
         "name":"mixolydian pentatonic",
         "aliases":[ "indian" ],
         "semitones":[ 0, 4, 5, 7, 10 ],
         "category":"Pentatonic",
         "bitmap":100011010010,
         "gaps":[ 4, 1, 2, 3, 2 ]
      },
      {
         "name":"lydian #5P pentatonic",
         "aliases":[],
         "semitones":[ 0, 4, 6, 8, 11 ],
         "category":"Pentatonic",
         "bitmap":100010101001,
         "gaps":[ 4, 2, 2, 3, 1 ]
      },
      {
         "name":"major pentatonic",
         "aliases":[ "pentatonic" ],
         "semitones":[ 0, 2, 4, 7, 9 ],
         "category":"Pentatonic",
         "bitmap":101010010100,
         "gaps":[ 2, 2, 3, 2, 3 ]
      },
      {
         "name":"major flat two pentatonic",
         "aliases":[],
         "semitones":[ 0, 1, 4, 7, 9 ],
         "category":"Pentatonic",
         "bitmap":110010010100,
         "gaps":[ 1, 3, 3, 2, 3 ]
      },
      {
         "name":"flat six pentatonic",
         "aliases":[],
         "semitones":[ 0, 2, 4, 7, 8 ],
         "category":"Pentatonic",
         "bitmap":101010011000,
         "gaps":[ 2, 2, 3, 1, 4 ]
      }
   ],
   "Blues":[
      {
         "name":"major blues",
         "aliases":[],
         "semitones":[ 0, 2, 3, 4, 7, 9 ],
         "category":"Blues",
         "bitmap":101110010100,
         "gaps":[ 2, 1, 1, 3, 2, 3 ]
      },
      {
         "name":"minor blues",
         "aliases":[ "blues" ],
         "semitones":[ 0, 3, 5, 6, 7, 10 ],
         "category":"Blues",
         "bitmap":100101110010,
         "gaps":[ 3, 2, 1, 1, 3, 2 ]
      },
      {
         "name":"composite blues",
         "aliases":[],
         "semitones":[ 0, 2, 3, 4, 5, 6, 7, 9, 10 ],
         "category":"Blues",
         "bitmap":101111110110,
         "gaps":[ 2, 1, 1, 1, 1, 1, 2, 1, 2 ]
      }
   ],
   "Indian":[
      {
         "name":"malkos raga",
         "aliases":[],
         "semitones":[ 0, 3, 5, 8, 10 ],
         "category":"Indian",
         "bitmap":100101001010,
         "gaps":[ 3, 2, 3, 2, 2 ]
      },
      {
         "name":"purvi raga",
         "aliases":[],
         "semitones":[ 0, 1, 4, 5, 6, 7, 8, 11 ],
         "category":"Indian",
         "bitmap":110011111001,
         "gaps":[ 1, 3, 1, 1, 1, 1, 3, 1 ]
      },
      {
         "name":"todi raga",
         "aliases":[],
         "semitones":[ 0, 1, 3, 6, 7, 8, 11 ],
         "category":"Indian",
         "bitmap":110100111001,
         "gaps":[ 1, 2, 3, 1, 1, 3, 1 ]
      },
      {
         "name":"kafi raga",
         "aliases":[],
         "semitones":[ 0, 3, 4, 5, 7, 9, 10, 11 ],
         "category":"Indian",
         "bitmap":100111010111,
         "gaps":[ 3, 1, 1, 2, 2, 1, 1, 1 ]
      }
   ],
   "Jazz":[
      {
         "name":"harmonic major",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 7, 8, 11 ],
         "category":"Jazz",
         "bitmap":101011011001,
         "gaps":[ 2, 2, 1, 2, 1, 3, 1 ]
      },
      {
         "name":"altered",
         "aliases":[ "super locrian", "diminished whole tone", "pomeroy" ],
         "semitones":[ 0, 1, 3, 4, 6, 8, 10 ],
         "category":"Jazz",
         "bitmap":110110101010,
         "gaps":[ 1, 2, 1, 2, 2, 2, 2 ]
      },
      {
         "name":"harmonic minor",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 8, 11 ],
         "category":"Jazz",
         "bitmap":101101011001,
         "gaps":[ 2, 1, 2, 2, 1, 3, 1 ]
      },
      {
         "name":"minor six diminished",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 8, 9, 11 ],
         "category":"Jazz",
         "bitmap":101101011101,
         "gaps":[ 2, 1, 2, 2, 1, 1, 2, 1 ]
      },
      {
         "name":"leading whole tone",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 8, 10, 11 ],
         "category":"Jazz",
         "bitmap":101010101011,
         "gaps":[ 2, 2, 2, 2, 2, 1, 1 ]
      },
      {
         "name":"melodic minor second mode",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 7, 9, 10 ],
         "category":"Jazz",
         "bitmap":110101010110,
         "gaps":[ 1, 2, 2, 2, 2, 1, 2 ]
      },
      {
         "name":"chromatic",
         "aliases":[],
         "semitones":[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
         "category":"Jazz",
         "bitmap":111111111111,
         "gaps":[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
      },
      {
         "name":"melodic minor",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 9, 11 ],
         "category":"Jazz",
         "bitmap":101101010101,
         "gaps":[ 2, 1, 2, 2, 2, 2, 1 ]
      },
      {
         "name":"minor bebop",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 8, 10, 11 ],
         "category":"Jazz",
         "bitmap":101101011011,
         "gaps":[ 2, 1, 2, 2, 1, 2, 1, 1 ]
      },
      {
         "name":"augmented",
         "aliases":[],
         "semitones":[ 0, 3, 4, 7, 8, 11 ],
         "category":"Jazz",
         "bitmap":100110011001,
         "gaps":[ 3, 1, 3, 1, 3, 1 ]
      },
      {
         "name":"bebop locrian",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 6, 7, 8, 10 ],
         "category":"Jazz",
         "bitmap":110101111010,
         "gaps":[ 1, 2, 2, 1, 1, 1, 2, 2 ]
      },
      {
         "name":"minor hexatonic",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 7, 11 ],
         "category":"Jazz",
         "bitmap":101101010001,
         "gaps":[ 2, 1, 2, 2, 4, 1 ]
      },
      {
         "name":"melodic minor fifth mode",
         "aliases":[ "hindu", "mixolydian b6M" ],
         "semitones":[ 0, 2, 4, 5, 7, 8, 10 ],
         "category":"Jazz",
         "bitmap":101011011010,
         "gaps":[ 2, 2, 1, 2, 1, 2, 2 ]
      },
      {
         "name":"augmented heptatonic",
         "aliases":[],
         "semitones":[ 0, 3, 4, 5, 7, 8, 11 ],
         "category":"Jazz",
         "bitmap":100111011001,
         "gaps":[ 3, 1, 1, 2, 1, 3, 1 ]
      },
      {
         "name":"bebop minor",
         "aliases":[],
         "semitones":[ 0, 2, 3, 4, 5, 7, 9, 10 ],
         "category":"Jazz",
         "bitmap":101111010110,
         "gaps":[ 2, 1, 1, 1, 2, 2, 1, 2 ]
      },
      {
         "name":"bebop major",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 7, 8, 9, 11 ],
         "category":"Jazz",
         "bitmap":101011011101,
         "gaps":[ 2, 2, 1, 2, 1, 1, 2, 1 ]
      },
      {
         "name":"six tone symmetric",
         "aliases":[],
         "semitones":[ 0, 1, 4, 5, 8, 9 ],
         "category":"Jazz",
         "bitmap":110011001100,
         "gaps":[ 1, 3, 1, 3, 1, 3 ]
      },
      {
         "name":"bebop",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 7, 9, 10, 11 ],
         "category":"Jazz",
         "bitmap":101011010111,
         "gaps":[ 2, 2, 1, 2, 2, 1, 1, 1 ]
      },
      {
         "name":"whole tone",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 8, 10 ],
         "category":"Jazz",
         "bitmap":101010101010,
         "gaps":[ 2, 2, 2, 2, 2, 2 ]
      },
      {
         "name":"double harmonic major",
         "aliases":[ "gypsy" ],
         "semitones":[ 0, 1, 4, 5, 7, 8, 11 ],
         "category":"Jazz",
         "bitmap":110011011001,
         "gaps":[ 1, 3, 1, 2, 1, 3, 1 ]
      },
      {
         "name":"diminished",
         "aliases":[],
         "semitones":[ 0, 2, 3, 5, 6, 8, 9, 11 ],
         "category":"Jazz",
         "bitmap":101101101101,
         "gaps":[ 2, 1, 2, 1, 2, 1, 2, 1 ]
      },
      {
         "name":"bebop dominant",
         "aliases":[],
         "semitones":[ 0, 2, 4, 5, 7, 9, 10, 11 ],
         "category":"Jazz",
         "bitmap":101011010111,
         "gaps":[ 2, 2, 1, 2, 2, 1, 1, 1 ]
      }
   ],
   "Neapolitan":[
      {
         "name":"neopolitan",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 7, 8, 11 ],
         "category":"Neapolitan",
         "bitmap":110101011001,
         "gaps":[ 1, 2, 2, 2, 1, 3, 1 ]
      },
      {
         "name":"neopolitan major pentatonic",
         "aliases":[],
         "semitones":[ 0, 4, 5, 6, 10 ],
         "category":"Neapolitan",
         "bitmap":100011100010,
         "gaps":[ 4, 1, 1, 4, 2 ]
      },
      {
         "name":"neopolitan minor",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 7, 8, 11 ],
         "category":"Neapolitan",
         "bitmap":110101011001,
         "gaps":[ 1, 2, 2, 2, 1, 3, 1 ]
      },
      {
         "name":"neopolitan major",
         "aliases":[ "dorian b2" ],
         "semitones":[ 0, 1, 3, 5, 7, 9, 11 ],
         "category":"Neapolitan",
         "bitmap":110101010101,
         "gaps":[ 1, 2, 2, 2, 2, 2, 1 ]
      }
   ],
   "Promotheus":[
      {
         "name":"prometheus neopolitan",
         "aliases":[],
         "semitones":[ 0, 1, 4, 6, 9, 10 ],
         "category":"Promotheus",
         "bitmap":110010100110,
         "gaps":[ 1, 3, 2, 3, 1, 2 ]
      },
      {
         "name":"scriabin",
         "aliases":[],
         "semitones":[ 0, 1, 4, 7, 9 ],
         "category":"Promotheus",
         "bitmap":110010010100,
         "gaps":[ 1, 3, 3, 2, 3 ]
      },
      {
         "name":"prometheus",
         "aliases":[],
         "semitones":[ 0, 2, 4, 6, 9, 10 ],
         "category":"Promotheus",
         "bitmap":101010100110,
         "gaps":[ 2, 2, 2, 3, 1, 2 ]
      }
   ],
   "Misc Ethnic":[
      {
         "name":"oriental",
         "aliases":[],
         "semitones":[ 0, 1, 4, 5, 6, 9, 10 ],
         "category":"Misc Ethnic",
         "bitmap":110011100110,
         "gaps":[ 1, 3, 1, 1, 3, 1, 2 ]
      },
      {
         "name":"vietnamese 2",
         "aliases":[],
         "semitones":[ 0, 3, 5, 7, 10 ],
         "category":"Misc Ethnic",
         "bitmap":100101010010,
         "gaps":[ 3, 2, 2, 3, 2 ]
      },
      {
         "name":"hungarian major",
         "aliases":[],
         "semitones":[ 0, 3, 4, 6, 7, 9, 10 ],
         "category":"Misc Ethnic",
         "bitmap":100110110110,
         "gaps":[ 3, 1, 2, 1, 2, 1, 2 ]
      },
      {
         "name":"persian",
         "aliases":[],
         "semitones":[ 0, 1, 4, 5, 6, 8, 11 ],
         "category":"Misc Ethnic",
         "bitmap":110011101001,
         "gaps":[ 1, 3, 1, 1, 2, 3, 1 ]
      },
      {
         "name":"romanian minor",
         "aliases":[],
         "semitones":[ 0, 2, 3, 6, 7, 9, 10 ],
         "category":"Misc Ethnic",
         "bitmap":101100110110,
         "gaps":[ 2, 1, 3, 1, 2, 1, 2 ]
      },
      {
         "name":"balinese",
         "aliases":[],
         "semitones":[ 0, 1, 3, 5, 7, 8, 11 ],
         "category":"Misc Ethnic",
         "bitmap":110101011001,
         "gaps":[ 1, 2, 2, 2, 1, 3, 1 ]
      },
      {
         "name":"piongio",
         "aliases":[],
         "semitones":[ 0, 2, 5, 7, 9, 10 ],
         "category":"Misc Ethnic",
         "bitmap":101001010110,
         "gaps":[ 2, 3, 2, 2, 1, 2 ]
      },
      {
         "name":"egyptian",
         "aliases":[],
         "semitones":[ 0, 2, 5, 7, 10 ],
         "category":"Misc Ethnic",
         "bitmap":101001010010,
         "gaps":[ 2, 3, 2, 3, 2 ]
      },
      {
         "name":"flamenco",
         "aliases":[],
         "semitones":[ 0, 1, 3, 4, 6, 7, 10 ],
         "category":"Misc Ethnic",
         "bitmap":110110110010,
         "gaps":[ 1, 2, 1, 2, 1, 3, 2 ]
      },
      {
         "name":"hungarian minor",
         "aliases":[],
         "semitones":[ 0, 2, 3, 6, 7, 8, 11 ],
         "category":"Misc Ethnic",
         "bitmap":101100111001,
         "gaps":[ 2, 1, 3, 1, 1, 3, 1 ]
      },
      {
         "name":"vietnamese 1",
         "aliases":[],
         "semitones":[ 0, 3, 5, 7, 8 ],
         "category":"Misc Ethnic",
         "bitmap":100101011000,
         "gaps":[ 3, 2, 2, 1, 4 ]
      },
      {
         "name":"pelog",
         "aliases":[],
         "semitones":[ 0, 1, 3, 7, 8 ],
         "category":"Misc Ethnic",
         "bitmap":110100011000,
         "gaps":[ 1, 2, 4, 1, 4 ]
      }
   ],
   "Spanish":[
      {
         "name":"spanish heptatonic",
         "aliases":[],
         "semitones":[ 0, 3, 4, 5, 6, 8, 10 ],
         "category":"Spanish",
         "bitmap":100111101010,
         "gaps":[ 3, 1, 1, 1, 2, 2, 2 ]
      },
      {
         "name":"spanish",
         "aliases":[ "phrygian major" ],
         "semitones":[ 0, 1, 4, 5, 7, 8, 10 ],
         "category":"Spanish",
         "bitmap":110011011010,
         "gaps":[ 1, 3, 1, 2, 1, 2, 2 ]
      }
   ]
}
