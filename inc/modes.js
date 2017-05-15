/* modes.js */
/* a map of musical modes, scales and intervals */
/* this file does not (yet?) recognize quarter tones   */

/* Author:  Jørgen W. Lang      */
/* Version: 0.0.1               */
/* Date:    May 15 2017         */

/* References:
  https://en.wikipedia.org/wiki/Interval_(music)
  https://en.wikipedia.org/wiki/Mode_(music)  
*/

/*
There are various ways of expressing the distance between two
notes in a scale. Some use shorthand for the actual intervals
as shown in https://en.wikipedia.org/wiki/Interval_(music).
Others use 2-1-2-... syntax to describe the "gaps" between
two notes in a given scale. And as if this wasn't enough,
certain scales can also have various names. Oh my!
*/

/*
intervals

* an array of objects
* index of array elements is also the number of
  semitones from the root
* we can use this to translate between different systems of describing 
  scales and modes

Properties:
* name:            canonical name of the interval
* semitones:       number of semitones from root (same as array index)
* short:           Shorthand for interval name
* augdim_name:     Name of augmented or diminished interval
* augdim_short:    Shorthand for augmented or diminished interval name
* alt_names:       a list of alternative names for the given interval
* alt_names_short: Shorthand for common alternative name

Edge case Tritone: has two augdim names/shorthands, split on pipe char (|)
                   to get both alternatives

*/
var intervals = [
  {
    'name':            'Perfect Unison',
    'semitones':       0,
    'short':           'P1',
    'augdim_name':     'Diminished second',
    'augdim_short':    'd2',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Minor second',
    'semitones':       1,
    'short':           'm2',
    'augdim_name':     'Augmented unison',
    'augdim_short':    'A1',
    'alt_names':       ['Semitone', 'half tone', 'half step'],
    'alt_names_short': 'S',
  },
  {
    'name':            'Major second',
    'semitones':       2,
    'short':           'M2',
    'augdim_name':     'Diminished third',
    'augdim_short':    'd3',
    'alt_names':       ['Tone', 'whole tone', 'whole step'],
    'alt_names_short': 'T',
  },
  {
    'name':            'Minor third',
    'semitones':       3,
    'short':           'm3',
    'augdim_name':     'Augmented second',
    'augdim_short':    'A2',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Major third',
    'semitones':       4,
    'short':           'M3',
    'augdim_name':     'Diminished fourth',
    'augdim_short':    'd4',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Perfect fourth',
    'semitones':       5,
    'short':           'P4',
    'augdim_name':     'Augmented third',
    'augdim_short':    'A3',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Tritone',
    'semitones':       6,
    'short':           '',
    'augdim_name':     'Diminished fifth|Augmented fourth',
    'augdim_short':    'd5|A4',
    'alt_names':       [],
    'alt_names_short': 'TT',
  },
  {
    'name':            'Perfect fifth',
    'semitones':       7,
    'short':           'P5',
    'augdim_name':     'Diminished sixth',
    'augdim_short':    'd6',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Minor sixth',
    'semitones':       8,
    'short':           'm6',
    'augdim_name':     'Augmented fifth',
    'augdim_short':    'A5',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Major sixth',
    'semitones':       9,
    'short':           'M6',
    'augdim_name':     'Diminished seventh',
    'augdim_short':    'd7',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Minor seventh',
    'semitones':       10,
    'short':           'm7',
    'augdim_name':     'Augmented sixth',
    'augdim_short':    'A6',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Major seventh',
    'semitones':       11,
    'short':           'M7',
    'augdim_name':     'Diminished octave',
    'augdim_short':    'd8',
    'alt_names':       [],
    'alt_names_short': '',
  },
  {
    'name':            'Perfect Octave',
    'semitones':       12,
    'short':           'P8',
    'augdim_name':     'Augmented seventh',
    'augdim_short':    'A7',
    'alt_names':       [],
    'alt_names_short': '',
  }
];

/* quick test */
document.write( intervals[5]['augdim_name'] );