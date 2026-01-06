# Audio to MIDI Converter

A Python script for batch converting audio files to MIDI format using Spotify's basic-pitch library.

## Features

- Batch convert multiple audio files to MIDI
- Supports various audio formats: WAV, MP3, FLAC, OGG, M4A
- Command-line interface
- Progress tracking and error reporting
- Automatic output directory creation

## Installation

1. Install Python 3.7+ if not already installed
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Command Line

```bash
python audio_to_midi.py <input_folder> <output_folder>
```

### Example

```bash
python audio_to_midi.py audio_files midi_output
```

This will:
- Scan the `audio_files` folder for supported audio files
- Convert each file to MIDI format
- Save the MIDI files in the `midi_output` folder

## Supported Audio Formats

- `.wav`
- `.mp3`
- `.flac`
- `.ogg`
- `.m4a`

## Output

For each input audio file (e.g., `song.wav`), the script creates a corresponding MIDI file (e.g., `song_basic_pitch.mid`) in the output folder.

## Troubleshooting

- Ensure audio files are in a supported format
- Check that the input folder exists and contains audio files
- Verify that basic-pitch is properly installed
- For best results, use clean, monophonic audio recordings

## Advanced Usage

The script uses basic-pitch's default parameters optimized for general use. For custom parameters, modify the script or use the basic-pitch command-line tool directly.

## Dependencies

- basic-pitch: Audio-to-MIDI conversion library
- pathlib: Path handling (included in Python 3.4+)
- os, sys: Standard library modules