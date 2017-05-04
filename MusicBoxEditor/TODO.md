# TODO

## Save and Load Project

### GUI
* Add button for saveing a project.
* Add button for loading a project file.

### Save
* Add every property of app.component to an object.(except logger, noteTable and mainMenuOptions).
* Serialize object to JSON.
* Promt user with download json-file.


### Load
* Promt user with file dialog and upload file (.json).
* Parse json and check if object is valid.
* Set variables in app component and update notes.

## Multipart download
* Option for multipart download in gui (checkbox or select).
* Clone svg in number of track parts.
* For every part, remove notes outside part (edge case: note is on the split).
* update viewbox for every part.
* Load files in zip.js
* Trigger download.


## Selected scale
Ask someone what is needed?

* Full, minor and custom.
* Full -> C, C#, D, D#, E....., set channels.
* Minor -> C, D, E, F, G ...., set channels.
* If any channels is changes, set to custom.


## Selecting start note
* Go from midi id to letter.


## Add note
* In track view.
* Show ghost note on hover.
* On click add note and sort notes.


## Move note
* In track view.
* On click down, remove note.
* Show ghost note.
* On click up add ghost note and sort notes.
* Hold shift for snap to grid.
* If action is not completed (drag outside of screen). Add note to old position. 


## Show more info
* Number of notes
* Number of track parts.
* Length of track in mm.
* Colliding notes -> orange?


## Extra options
* Show and hide grid.
* Show and hide track part number

